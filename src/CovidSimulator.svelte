<script>
  export let covidGraph
  export let region

  import wNumb from "wnumb"
  import RangeSlider from "./RangeSlider"
  import CovidGraph from "./CovidGraph"

  $: region = region[0].toUpperCase() + region.slice(1)
  let simulatorType = covidGraph

  let compartment = "Infected"
  let interventions = {
    "Shelter in place": [30, 160],
  }
  let values = [30, 160]
  let tooltip = wNumb({decimals: 0, thousand: ","})
</script>

<style>
  .title {
    margin-bottom: 0;
    font-size: 40px;
    margin-left: 2rem;
  }

  .subtitle {
    margin-top: 0;
    margin-left: 2rem;
    color: #807F8B;
    font-size: 15px;
  }

  .compartment-tabs {
    padding-left: 2rem;
  }

  .compartment-tabs button {
    background-color: transparent;
    border: none;
    line-height: 1.75rem;
    font-size: 15px;
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

  .controls {
    background-color: #F7EBDE;
    font-size: 15px;
    padding: 1.75rem 2.5rem;
  }

  .control-group {
    position: relative;
  }

  .control-name {
    font-weight: bold;
  }

  .control-label {
    display: inline-block;
    margin-top: 25px;
    width: 10%;
    text-align: center;
  }

  .slider-container {
    position: absolute;
    top: 33px;
    right: 0;
    width: 90%;
  }
</style>

<section class="covid-simulator">
  <section class="compartments">
    <h1 class="title">{region}</h1>
    <p class="subtitle">per million population</p>

    <nav class="compartment-tabs">
      <button class:active="{compartment === 'Infected'}" on:click="{() => compartment = 'Infected'}">Infections</button>
      <button class:active="{compartment === 'Dead'}" on:click="{() => compartment = 'Dead'}">Deaths</button>
    </nav>
    <CovidGraph region={region} interventions={interventions} compartment={compartment} />
  </section>

  <section class="controls">
    <section class="control">
      <div class="control-name">Shelter in place</div>
      <div class="control-group">
        <span class="control-label">Day</span>
        <div class="slider-container">
          <RangeSlider max="{300}" step="{1}" tooltip="{tooltip}" bind:values="{interventions["Shelter in place"]}"></RangeSlider>
        </div>
      </div>
    </section>
  </section>
</section>
