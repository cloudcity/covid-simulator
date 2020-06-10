import odex from "odex"
import np from "./num"
import unzip from "./unzip"

// Code to build and solve an age-structured SEIR epidemiological model.

// Some model assumptions:
//  - A basic compartmental (S-E-I-R) model, stratified by age cohorts
// (or any other division of the population such that individuals do not switch
// cohorts), and extended by comparments (SI-D) to account for those so
// severely infected that they will end up dying from the disease.
//  - Age is a discrete variable. See app.py or the deployed app for analytic
// expression of the relevant differential equations.
//  - No aging: The time horizon for the model is less than one year.
//  - No vital statistics: No birth or death, aside from possible deaths due to
// disease.
//  - The Exposed compartment are not infectious.

export let COMPARTMENTS = [
  'Susceptible',
  'Exposed',
  'Infected',
  'Severely Infected',
  'Recovered',
  'Dead',
];

let AGE_COHORTS = ['0-19', '20-59', '60+'];

let INFECTION_FATALITY = [0.0001, 0.0032, 0.0328];

// population fractions by region; UN 2020 data
export let WORLD_POP = {
  Africa: [0.507, 0.438, 0.055],
  Americas: [0.293, 0.541, 0.166],
  Asia: [0.312, 0.558, 0.131],
  Europe: [0.211, 0.532, 0.257],
};
Object.keys(WORLD_POP).forEach((k) => (WORLD_POP[k] = np.array(WORLD_POP[k])));

// UK data from the POLYMOD survey, basis for contact matrices
let CONTACT_DATA = np.pack([
  [7.86, 5.22, 0.5],
  [2.37, 7.69, 1.06],
  [1.19, 5.38, 1.92],
]);

function _symmetrize(pop_fracs, contact_data) {
  //"""Construct a contact matrix with reciprocity from empirical data."""
  let f = pop_fracs;
  let d = contact_data;
  let c = np.zeros([f.size, f.size]);

  f.data.forEach((_, i) => {
    f.data.forEach((_, j) => {
      let v = (d.get(i, j) * f.get(i) + d.get(j, i) * f.get(j)) / (2 * f.get(i));
      c.set(i, j, v);
    });
  });
  return c;
}

export let CONTACT_MATRICES_0 = {};
Object.keys(WORLD_POP).forEach(
  (k) => (CONTACT_MATRICES_0[k] = _symmetrize(WORLD_POP[k], CONTACT_DATA)),
);

// The effects of various non-pharmaceutical interventions.
// Chi denotes an overall multiplicative factor on the basic contact matrix.
// For cohort-based interventions, xi denotes a factor to be applied to
// contact matrix entries given by the corresponding indices.
let NPI_IMPACTS = {
  'Cancel mass gatherings': { chi: 0.72 },
  'Quarantine': { chi: 0.63 },
  'Quarantine and tracing': { chi: 0.48 },
  'School closure': {
    xi: 0,
    indices: [[0, 0]],
  },
  'Shelter in place': { chi: 0.34 },
  'Shielding the elderly': {
    xi: 0.5,
    indices: [
      [0, -1],
      [1, -1],
      [-1, 0],
      [-1, 1],
      [-1, -1],
    ],
  },
};

// Class to solve an age-structured SEIR Compartmental model.
//
// Attributes:
//     contacts: List of effective contact matrices, one per epoch. (An epoch
//         here denotes a period of set interventions.)
//     epoch_end_times: List of days at which transmission rates change.
//     alpha: Inverse incubation period
//     beta: Probability of transmission given a contact
//     gamma: Inverse duration of infection
//     delta: Inverse time to death
//     kappa: List of mortality rates, one per cohort
//     N_cohorts: Number of cohorts
//     compartments: List of names of compartments
//     N_compartments: Number of compartments
//     s, e, i, m, r, d: Indices of the compartments in the state vector y(t)
//
// External methods:
//     f: Function giving the rate of change in the state variable y(t).
//     solve: Integrate the coupled differential equations.
class SEIRModel {
  constructor(
    contact_matrices,
    epoch_end_times,
    incubation_period = 5.1,
    prob_of_transmission = 0.034,
    duration_of_infection = 6.3,
    time_to_death = 17.8,
    mortality_rates = INFECTION_FATALITY,
    N_cohorts = AGE_COHORTS.length,
  ) {
    if (epoch_end_times.length !== contact_matrices.length) {
      throw new Error('Each contact matrix requires an epoch end time.');
    }

    this.contacts = contact_matrices;
    this.epoch_end_times = epoch_end_times;
    this.alpha = 1 / incubation_period;
    this.beta = prob_of_transmission;
    this.gamma = 1 / duration_of_infection;
    this.delta = 1 / time_to_death;
    this.kappa = mortality_rates;
    this.N_cohorts = N_cohorts;

    // N.B. hard-coded values. The function f() assumes these compartments.
    this.compartments = COMPARTMENTS;
    this.N_compartments = 6;
    this.s = 0;
    this.e = 1;
    this.i = 2;
    this.m = 3;
    this.r = 4;
    this.d = 5;
  }
}

// Fetch the contact matrix for given time t.
SEIRModel.prototype._fetch_contact = function (t) {
  for (let i = 0; i < this.contacts.length; i++) {
    if (t <= this.epoch_end_times[i]) {
      return this.contacts[i];
    }
  }
};

// Function giving the rate of change in the state variable y(t).
SEIRModel.prototype.f = function (t, y) {
  if (isNaN(t)) {
    throw new Error("t can't be NaN");
  }
  if (y.data) {
    throw new Error('y should be an array, not ndarray');
  }
  if (y.find(isNaN)) {
    throw new Error("y can't contain NaN");
  }

  y = np.array(y, [this.N_cohorts, this.N_compartments]);
  let dy = np.zeros([this.N_cohorts, this.N_compartments]);

  let contact = this._fetch_contact(t);
  if (!contact) {
    console.log('oh no: ', [t, np.unpack(this.contacts)]);
  }
  let cohorts_range = Array.from(Array(this.N_cohorts).keys());
  for (let a of cohorts_range) {
    let infection_rate = cohorts_range
      .map(
        (b) =>
          (this.beta *
            contact.get(a, b) *
            (y.get(b, this.i) + y.get(b, this.m))) /
          np.sum(y.pick(b, null)),
      )
      .reduce((a, b) => a + b);
    dy.set(a, this.s, -y.get(a, this.s) * infection_rate);
    dy.set(
      a,
      this.e,
      y.get(a, this.s) * infection_rate - this.alpha * y.get(a, this.e),
    );
    dy.set(
      a,
      this.i,
      this.alpha * (1 - this.kappa[a]) * y.get(a, this.e) -
        this.gamma * y.get(a, this.i),
    );
    dy.set(
      a,
      this.m,
      this.alpha * this.kappa[a] * y.get(a, this.e) -
        this.delta * y.get(a, this.m),
    );
    dy.set(a, this.r, this.gamma * y.get(a, this.i));
    dy.set(a, this.d, this.delta * y.get(a, this.m));
  }
  let dy_flat = np.unpack(np.array(dy.data));
  if (dy_flat.find(isNaN)) {
    throw new Error("it broke, there's NaN", dy_flat);
  }
  return dy_flat;
};

SEIRModel.prototype.solve = function (y0) {
  let integrate = new odex.Solver(18);
  let epoch_end = this.epoch_end_times.slice(-1)[0];
  let t = [];
  let y = [];
  integrate.denseOutput = true;
  integrate.solve(
    this.f.bind(this), // function(t, y) returns y at t
    0, // initial t value
    y0, // initial y value
    epoch_end, // final t value
    // (x,x0,x1,y1) => console.log(["step", x,x0,x1,y1])) // per step callback
    integrate.grid(
      1, // step size
      (tS, yS) => {
        // per step callback
        // console.log(["step", tS, yS])
        t.push(tS);
        y.push(yS);
      },
    ),
  );
  return [t, y.flat()]
};

const zip = (arr, ...arrs) => {
  return arr.map((val, i) => arrs.reduce((a, arr) => [...a, arr[i]], [val]));
};

// Function to enumerate conact matrices and their epochs.
// Arguments:
//     contact_matrix: Basic contact matrix, without interventions
//     day_ranges: List of day range tuples denoting the period
//         during which interventions are applied
//     selected_npis: List of interventions, one for each date range
//     total_days: Total number of days to run model
//     npi_impacts: Dict of interventions of form {name: impact},
//         cf. NPI_IMPACTS above.
// Returns: A list of effective contact matrices and a list of epoch end times
SEIRModel.model_input = function (
  contact_matrix,
  day_ranges,
  selected_npis,
  total_days,
  npi_impacts = NPI_IMPACTS,
) {
  // create a sequence of tuples from a list
  // e.g., tuplize([0, 1, 2, 3]) -> [[0, 1], [1, 2], [2, 3]]
  let _tuplize = function (lst) {
    return lst.slice(0, -1).map((e, i) => lst.slice(i, i + 2))
  };

  // Partition day_ranges into unique, non-overlapping epochs.
  let _partition = function (day_ranges, total_days) {
    let flat_dates = day_ranges
      .flat()
      .concat(0, total_days)
      .sort((a, b) => a - b);
    return _tuplize(Array.from(new Set(flat_dates)));
  };

  let _range = function (start, end) {
    length = end - start;
    return Array.from(Array(length), (_, i) => i + start);
  };

  let _intersects = function (day_range, epoch_tuple) {
    let cs = _range(...day_range);
    let es = _range(...epoch_tuple);
    return cs.filter((i) => es.includes(i)).length > 1;
  };

  let _apply = function (npi, npi_impacts, contact_matrix) {
    let impact = npi_impacts[npi] || {};
    np.mulseq(contact_matrix, impact['chi'] || 1);
    for (let [x, y] of impact['indices'] || []) {
      let val = contact_matrix.get(x, y);
      contact_matrix.set(x, y, val * (impact['xi'] || 1));
    }
    return contact_matrix;
  };

  let epoch_tuples = _partition(day_ranges, total_days);
  let contact_matrices = [];

  for (let epoch of epoch_tuples) {
    let c_eff = np.pack(np.unpack(contact_matrix));
    for (let [day_range, npi] of zip(day_ranges, selected_npis)) {
      if (_intersects(day_range, epoch)) {
        c_eff = _apply(npi, npi_impacts, c_eff);
      }
    }
    contact_matrices.push(c_eff);
  }

  let epoch_ends = epoch_tuples.map((e) => e[1]);
  return [contact_matrices, epoch_ends];
};

let _colsum = (a) =>
  np.unpack(a).map((a) => {
    return zip(...a).map((i) => i.reduce((a, b) => a + b));
  });

SEIRModel.generateData = function(region, interventions, days) {
  let TOTAL_POPULATION = 1000000
  let START_DAY = 0
  let END_DAY = days
  let initial_infected = (0.1 * 0.01)

  let population = np.unpack(WORLD_POP[region]).map(e => e * TOTAL_POPULATION)
  let pop_0 = population.map(f => [
      f * (1 - 2 * initial_infected),
      f * initial_infected,
      f * initial_infected,
      0, 0, 0,
  ])

  let [contact_matrices, epoch_end_times] = SEIRModel.model_input(
    CONTACT_MATRICES_0[region],
    Object.values(interventions),
    Object.keys(interventions),
    END_DAY-START_DAY
  )

  let model = new SEIRModel(contact_matrices, epoch_end_times)
  let [t, y] = model.solve(pop_0.flat())
  let results = np.array(y, [t.length, model.N_cohorts, model.N_compartments]);
  let aggregates = unzip(_colsum(results))

  let data = {}
  COMPARTMENTS.forEach((c,i) => data[c] = aggregates[i])
  data["cohortDeaths"] = np.unpack(results.pick(END_DAY, null, 5))

  return data
}

export default SEIRModel;
