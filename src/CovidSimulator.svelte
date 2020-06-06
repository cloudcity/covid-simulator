<script>
  export let covidGraph
  export let region

  import _ from "lodash"
  import CovidGraph from "./CovidGraph.svelte"

  $: region = _.capitalize(region)
  let simulatorType = covidGraph

  let compartment = "Infected"
  let interventions = {
    "Shelter in place": [30, 160],
  }
</script>

<style>
  h1 {
    margin-bottom: 0;
    font-size: 24pt;
  }

  .subtitle {
    margin-top: -0.5em;
  }

  .compartment-tabs {
    padding-left: 2rem;
  }

  .compartment-tabs button {
    background-color: transparent;
    border: none;
    line-height: 1.75rem;
    font-size: 10pt;
    width: 8rem;
    color: #D35C08;
  }

  .compartment-tabs button.active {
    color: #4A495B;
    border-top: 2px solid #4A495B;
    font-weight: bold;
    background-color: #F7F7F8;
  }

  button:focus {outline:0;}
</style>

<section class="covid-simulator">
  <section class="compartments">
    <h1>{region}</h1>
    <p class="subtitle">per million population</p>

    <nav class="compartment-tabs">
      <button class:active="{compartment === 'Infected'}" on:click="{() => compartment = 'Infected'}">Infections</button>
      <button class:active="{compartment === 'Dead'}" on:click="{() => compartment = 'Dead'}">Deaths</button>
    </nav>
    <CovidGraph region={region} interventions={interventions} compartment={compartment} />
  </section>

  <section class="controls">
    <p>slider here</p>
  </section>
</section>
