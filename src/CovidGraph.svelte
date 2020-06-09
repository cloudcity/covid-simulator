<script>
  export let compartment
  export let region
  export let interventions

  import { onMount } from "svelte"
  import { writable } from "svelte/store"
  import vegaEmbed from "vega-embed"

  import model from "./model"

  let vega, vegaElement
  let deathCounts = []
  let modelData = {}
  let seriesData = []
  let vegaSpec = {}

  $: modelData = model.generateData(region, interventions)
  $: seriesData = modelData[compartment].map((v,d) => ({days: d, pop: Math.round(v)}))
  $: deathCounts = modelData["cohortDeaths"].map(Math.round).map(n => n.toLocaleString())
  $: deathsTotal = Math.round(modelData["cohortDeaths"].reduce((t,n) => t+n)).toLocaleString()
  $: vegaSpec = spec(compartment)
  $: {
    if (vegaElement && vegaSpec) {
      vegaEmbed(vegaElement, vegaSpec).
        then(result => result.view.insert("seriesData", seriesData).run()).
        catch(console.error);
    }
  }

  function spec(compartment) {
    let subtitleName = {
      "Infected": "infections",
      "Dead": "deaths",
    }[compartment]

    let yHeight = {
      "Infected": 100000,
      "Dead": 8000,
    }[compartment]

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
      "title": {
        "text": `Number of daily COVID-19 ${subtitleName} in the region`,
        "anchor": "start",
        "font": "Karla",
        "fontWeight": "normal",
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
            "title": "Days since first infection",
            "titleFontSize": 13,
          },
          "field": "days",
          "scale": {
            "domain": [0,300]
          }
        },
        "y": {
          "type": "quantitative",
          "axis": {
            "title": null,
          },
          "field": "pop",
          "scale": {
            "domain": [ 0, yHeight ]
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
    padding: 0.5rem 1.5rem;
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
</style>

<div class="covid-graph-container">
  <div class="covid-graph-vega" bind:this={vegaElement}></div>
  <section class="numbers">
    <p><span class="big">Final deaths</span> per million per day</p>
    <p>&lt; 19 years old<span class="big">{deathCounts[0]}</span></p>
    <p>20 - 59 years old<span class="big">{deathCounts[1]}</span></p>
    <p>60+ years old<span class="big">{deathCounts[2]}</span></p>
    <p class="total">Total <span class="big">{deathsTotal}</span></p>
  </section>
</div>
