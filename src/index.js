import SEIRModel from './model'

window.SEIRModel = SEIRModel
// document.addEventListener("DOMContentLoaded", () => {
//   TOTAL_POPULATION = 1000000
//   START_DAY = 0
//   END_DAY = 300
//   initial_infected = (0.1 * 0.01)

//   region_option = "Africa"
//   population = np.unpack(WORLD_POP[region_option]).map(e => e * TOTAL_POPULATION)
//   pop_0 = population.map(f => [
//       f * (1 - 2 * initial_infected),
//       f * initial_infected,
//       f * initial_infected,
//       0, 0, 0,
//   ])

//   mixing_range = [30, 160]

//   let contact_matrices, epoch_end_times
//   [contact_matrices, epoch_end_times] = SEIRModel.model_input(
//       CONTACT_MATRICES_0[region_option],
//       [mixing_range],
//       ['Shelter in place'],
//       END_DAY-START_DAY
//   )

//   res = new SEIRModel(contact_matrices, epoch_end_times)
//   res.solve_to_dataframe(pop_0.flat())
// })
