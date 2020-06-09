<script>
  export let covidGraph
  export let region

  import wNumb from "wnumb"
  import RangeSlider from "./RangeSlider"
  import CovidGraph from "./CovidGraph"

  $: region = region[0].toUpperCase() + region.slice(1)
  let stacked = (covidGraph === "stacked")
  let simple = (covidGraph === "simple")

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
    font-size: 15px;
  }

  .control {
    padding: 1.75rem 2.5rem;
  }

  .control-highlight {
    background-color: #F7EBDE;
  }

  .control-group {
    position: relative;
  }

  .control-name {
    font-weight: bold;
  }

  .simple .control-label {
    display: inline-block;
    margin-top: 25px;
    width: 10%;
    text-align: center;
  }

  .simple .slider-container {
    position: absolute;
    top: 33px;
    right: 0;
    width: 90%;
  }

  .stacked {
    display: flex;
    outline: 1px solid red;
  }

  .stacked .compartments {
    flex: 70%;
  }

  .stacked .controls {
    flex: 30%;
    order: -1;
    display: flex;
    flex-flow: column nowrap;
  }

  .stacked .control {
    padding: 1rem 0;
  }

  .stacked .control-label {
    width: 100%;
  }

  .radio-container {
    display: inline-block;
    position: relative;
    padding: 0 6px;
    margin: 10px 0 0;
  }

  .radio-container input[type='radio'] {
    display: none;
  }

  .radio-container label {
  }

  .radio-container label:before {
    content: " ";
    display: inline-block;
    position: relative;
    top: 2px;
    margin: 0 3px 0 0;
    width: 12px;
    height: 12px;
    border-radius: 10px;
    border: 1px solid #D5D5DE;
    background-color: transparent;
  }

  .radio-container input[type=radio]:checked + label:after {
    border-radius: 11px;
    width: 8px;
    height: 8px;
    position: absolute;
    top: 5px;
    left: 9px;
    content: " ";
    display: block;
    background: #D35C08;
  }
</style>

<section class="covid-simulator" class:stacked class:simple>
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
    {#if stacked}
    <section class="control">
      <div class="control-name">Contact quarantine strategy</div>
      <div class="control-group">
        <div class="radio-container">
          <input type="radio" id="strategy-quarantine" name="strategy" value="quarantine" checked>
          <label class="control-label" for="strategy-quarantine">Household quarantine</label>
        </div>
        <div class="radio-container">
          <input type="radio" id="strategy-tracing" name="strategy" value="tracing">
          <label class="control-label" for="strategy-tracing">Extended contact tracing</label>
        </div>
      </div>
      <div class="control-group">
        <span class="control-label">Day</span>
        <div class="slider-container">
          <RangeSlider max="{300}" step="{1}" tooltip="{tooltip}" bind:values="{interventions["Shelter in place"]}"></RangeSlider>
        </div>
      </div>
    </section>
    {/if}
    <section class="control control-highlight">
      <div class="control-name">Shelter in place</div>
      <div class="control-group">
        <span class="control-label">Day</span>
        <div class="slider-container">
          <RangeSlider max="{300}" step="{1}" tooltip="{tooltip}" bind:values="{interventions["Shelter in place"]}"></RangeSlider>
        </div>
      </div>
    </section>
    {#if stacked}
    <section class="control">
      <div class="control-name">Schools closed</div>
      <div class="control-group">
        <span class="control-label">Day</span>
        <div class="slider-container">
          <RangeSlider max="{300}" step="{1}" tooltip="{tooltip}" bind:values="{interventions["Shelter in place"]}"></RangeSlider>
        </div>
      </div>
    </section>
    <section class="control">
      <div class="control-name">Mass gatherings cancelled</div>
      <div class="control-group">
        <span class="control-label">Day</span>
        <div class="slider-container">
          <RangeSlider max="{300}" step="{1}" tooltip="{tooltip}" bind:values="{interventions["Shelter in place"]}"></RangeSlider>
        </div>
      </div>
    </section>
    <section class="control">
      <div class="control-name">Shielding the elderly</div>
      <div class="control-group">
        <span class="control-label">Day</span>
        <div class="slider-container">
          <RangeSlider max="{300}" step="{1}" tooltip="{tooltip}" bind:values="{interventions["Shelter in place"]}"></RangeSlider>
        </div>
      </div>
    </section>
    {/if}      
  </section>
</section>
