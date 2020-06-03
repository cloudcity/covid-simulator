import SEIRModel, { WORLD_POP, CONTACT_MATRICES_0, COMPARTMENTS } from "./model"
import np from "./num"
import unzip from "./unzip"
import vegaEmbed from "vega-embed"

function generateModelData() {
  let TOTAL_POPULATION = 1000000
  let START_DAY = 0
  let END_DAY = 300
  let initial_infected = (0.1 * 0.01)

  let region_option = "Africa"
  let population = np.unpack(WORLD_POP[region_option]).map(e => e * TOTAL_POPULATION)
  let pop_0 = population.map(f => [
      f * (1 - 2 * initial_infected),
      f * initial_infected,
      f * initial_infected,
      0, 0, 0,
  ])

  let mixing_range = [30, 160]

  let [contact_matrices, epoch_end_times] = SEIRModel.model_input(
      CONTACT_MATRICES_0[region_option],
      [mixing_range],
      ['Shelter in place'],
      END_DAY-START_DAY
  )

  let res = new SEIRModel(contact_matrices, epoch_end_times)
  let modelData = unzip(res.solve_to_dataframe(pop_0.flat()))
  return modelData
}

let colors = {
	blue: 'rgb(54, 162, 235)',
	green: 'rgb(75, 192, 192)',
	grey: 'rgb(201, 203, 207)',
	orange: 'rgb(255, 159, 64)',
	purple: 'rgb(153, 102, 255)',
	red: '#e45756',
	yellow: 'rgb(255, 205, 86)',
};

let compartmentColors = [
  colors.grey, // 'Susceptible',
  colors.yellow, // 'Exposed',
  colors.red, // 'Infected',
  colors.purple, // 'Severely Infected',
  colors.green, // 'Recovered',
  colors.blue, // 'Dead',
]

const capitalize = ws => ws.split(' ').map(w => w[0].toUpperCase()+ w.substring(1)).join(' ')

class CovidSimulator {
  constructor(e) {
    this.element = e
    this.name = capitalize(e.dataset.compartment)
    this.graphType = e.dataset.covidGraph

    let i = COMPARTMENTS.indexOf(this.name)
    this.modelData = generateModelData()
    this.series = this.modelData[i].map((v,d) => {
      return {days: d, pop: Math.round(v)}
    })
    this.color = compartmentColors[i]

    this.chart = this.renderChart()
  }

  renderChart() {
    vegaEmbed(this.element, this.spec(this.name)).then(result => {
      result.view.insert("seriesData", this.series).run()
    }).catch(console.error);
  }

  spec(name) {
    return {
      "config": {
        "view": {
          "continuousWidth": 400,
          "continuousHeight": 300
        }
      },
      "title": {
        "text": name,
        "anchor": "start",
        "font": "Karla",
        "subtitle": `Number of daily COVID-19 ${name.toLowerCase()} in the region`,
        "subtitleFont": "Karla",
      },
      "data": {
        "name": "seriesData"
      },
      "mark": {
        "type": "line",
        "strokeWidth": 3,
        "color": {
          "x1": 1,
          "y1": 1,
          "x2": 1,
          "y2": 0,
          "gradient": "linear",
          "stops": [
            {
              "offset": 0,
              "color": "#F0883F"
            },
            {
              "offset": 1,
              "color": "#D31408"
            }
          ]
        },
      },
      "encoding": {
        "x": {
          "type": "quantitative",
          "axis": {
            "title": "Days",
            "titleFont": "Karla",
            "titleColor": "red",
          },
          "field": "days",
          "scale": {
            "domain": [0,300]
          }
        },
        "y": {
          "type": "quantitative",
          "axis": {
            "title": `Number ${name}`,
            "titleFont": "Karla",
            "titleColor": "red",
          },
          "field": "pop",
          "scale": {
            "domain": [ 0, 100000 ]
          }
        }
      },
      "$schema": "https://vega.github.io/schema/vega-lite/v4.8.1.json",
      "autosize": {
        "type": "fit",
        "contains": "padding"
      },
      "width": 660,
      "padding": {
        "bottom": 20
      }
    }
  }
}

export default CovidSimulator
