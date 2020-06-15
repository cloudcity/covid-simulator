<script>
  export let compartment
  export let region
  export let interventions
  export let days

  import { onMount } from "svelte"
  import { writable } from "svelte/store"
  import vegaEmbed from "vega-embed"

  import model from "./model"

  let vega, vegaElement
  let deathCounts = []
  let modelData = {}
  let compartmentName
  let seriesData = []
  let worstCases = {}
  let vegaSpec = {}

  $: modelData = model.generateData(region, interventions, days)
  $: compartmentName = (compartment === "Infected") ? "Combined Infected" : compartment
  $: seriesData = modelData[compartmentName].map((v,d) => ({days: d, pop: Math.round(v)}))
  $: deathCounts = modelData["cohortDeaths"].map(Math.round).map(n => n.toLocaleString())
  $: deathsTotal = Math.round(modelData["cohortDeaths"].reduce((t,n) => t+n)).toLocaleString()
  $: {
    let modelWorstData = model.generateData(region, {}, days)
    worstCases = {}
    for (let key in modelWorstData) {
      worstCases[key] = modelWorstData[key].reduce((m,n) => m > n ? m : n)
    }
  }
  $: vegaSpec = spec(worstCases, compartment, days)
  $: {
    if (vegaElement && vegaSpec) {
      vegaEmbed(vegaElement, vegaSpec).
        then(result => result.view.insert("seriesData", seriesData).run()).
        catch(console.error);
    }
  }

  function spec(worstCases, compartment) {
    let yTitle = {
      "Infected": "Currently infected per million",
      "Dead": "Cumulative deaths per million",
    }[compartment]

    let yHeight = worstCases[compartment]

    return {
      "config": {
        "view": {
          "continuousWidth": 400,
          "continuousHeight": 300,
        },
        "axis": {
          "titleFont": "Karla",
          "titleFontSize": 13,
          "labelFont": "Karla",
          "labelFontSize": 13,
        },
      },
      "data": {
        "name": "seriesData"
      },
      "mark": {
        "type": "line",
        "clip": true,
        "strokeWidth": 4,
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
            "title": "Day",
            "titleFontSize": 13,
            "titleFontWeight": "normal",
            "labelFlush": false,
          },
          "field": "days",
          "scale": {
            "domain": [0, days]
          }
        },
        "y": {
          "type": "quantitative",
          "axis": {
            "title": yTitle,
            "titleFontWeight": "normal",
            "titleFontSize": 13,
          },
          "field": "pop",
          "scale": {
            "domain": [0, yHeight]
          }
        }
      },
      "$schema": "https://vega.github.io/schema/vega-lite/v4.8.1.json",
      "width": "container",
      "height": 300,
      "autosize": {
        "type": "fit",
        "contains": "padding"
      },
      "padding": {
        "bottom": 10,
      },
      "background": "#F7F7F8",
    }
  }
</script>

<style>
  .covid-graph-container {
    position: relative;
    background-color: #F7F7F8;
    padding: 2rem 2rem 1rem 2rem;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
  }

  .covid-graph-vega {
    width: 92%;
  }

  .numbers {
    clear: both;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    max-width: 45rem;
  }

  .numbers p {
    padding: 0.5rem 1.2rem;
    text-align: center;
    font-size: 13px;
    color: #807F8B;
    flex-grow: 1;
  }

  .numbers p .big {
    display: block;
    font-size: 20px;
    color: #4A495B;
  }

  .numbers .total {
    background-color: #FFFFFF;
  }

  .footnote {
    font-size: 12px;
    margin-top: -10px;
    z-index: 10;
    line-height: 1em;
  }
</style>

<div class="covid-graph-container">
  <div class="covid-graph-vega" bind:this={vegaElement}></div>
  <section class="footnote">
    The simulation begins on day zero with 1,000 people infected, 1,000 people exposed, and 1 million people total.
  </section>
  <section class="numbers">
    <p><span class="big">Deaths</span> per million</p>
    <p>&lt; 19 years old<span class="big">{deathCounts[0]}</span></p>
    <p>20 - 59 years old<span class="big">{deathCounts[1]}</span></p>
    <p>60+ years old<span class="big">{deathCounts[2]}</span></p>
    <p class="total">Total <span class="big">{deathsTotal}</span></p>
  </section>
</div>
