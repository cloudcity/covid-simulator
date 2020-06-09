<script>
  export let covidGraph
  export let region

  import wNumb from "wnumb"
  import RangeSlider from "./RangeSlider"
  import CovidGraph from "./CovidGraph"

  $: region = region[0].toUpperCase() + region.slice(1)
  let stacked = (covidGraph === "stacked")
  let simple = !stacked

  let compartment = "Infected"
  let tooltip = wNumb({decimals: 0, thousand: ","})

  let quarantine, ranges, tracing
  let interventions = {}

  if (simple) {
    ranges = {"Shelter in place": [30, 160]}
  } else {
    ranges = {
      "Cancel mass gatherings": [30, 80],
      "School closure": [30, 70],
      "Shelter in place": [20, 20],
      "Shielding the elderly": [30, 100],
    }
    quarantine = [70, 200]
    tracing = false
  }

  $: {
    interventions = {}
    Object.keys(ranges).forEach(key => interventions[key] = ranges[key])
    if (stacked) interventions[tracing ? "Quarantine and tracing" : "Quarantine"] = quarantine
  }
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

  .control-note {
    font-size: 13px;
    margin-top: -5px;
    margin-bottom: 5px;
  }

  .control-label {
    display: inline-block;
  }

  .simple .control-label {
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
    flex-flow: column nowrap;
  }

  .stacked .controls {
    width: 100%;
    display: flex;
    justify-content: center;
    flex-flow: column nowrap;
  }

  @media only screen and (min-width : 768px) {
    .stacked {
      flex-flow: row nowrap;
    }      

    .stacked .compartments {
      width: 70%;
    }

    .stacked .controls {
      width: 30%;
      order: -1;
    }
  }

  .stacked .control {
    padding: 20px;
  }

  .stacked .control-name {
    margin-bottom: 10px;
  }

  .stacked .slider {
    margin-top: 30px;
    padding-bottom: 10px;
  }

  .radio {
    display: inline-block;
    position: relative;
    padding: 0;
    margin: 0;
  }

  .radio .control-label {
    margin: 0 10px 10px 0;
  }

  .radio input[type='radio'] {
    display: none;
  }

  .radio label {
    display: block;
    color: #807F8B;
  }

  .radio label:before {
    content: " ";
    display: inline-block;
    position: relative;
    top: 2px;
    margin: 0 7px 0 0;
    width: 12px;
    height: 12px;
    border-radius: 10px;
    border: 1px solid #D5D5DE;
    background-color: transparent;
  }

  .radio input[type=radio]:checked + label:after {
    border-radius: 11px;
    width: 8px;
    height: 8px;
    position: absolute;
    top: 5px;
    left: 3px;
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
      <button class:active={compartment === 'Infected'} on:click={() => compartment = 'Infected'}>Infections</button>
      <button class:active={compartment === 'Dead'} on:click={() => compartment = 'Dead'}>Deaths</button>
    </nav>
    <CovidGraph region={region} interventions={interventions} compartment={compartment} />
  </section>

  <section class="controls">
    {#if stacked}
      <section class="control control-radio">
        <div class="control-name">Contact quarantine strategy</div>
        <div class="control-group radio">
          <input type="radio" id="strategy-quarantine" bind:group={tracing} value={false}>
          <label class="control-label" for="strategy-quarantine">Household quarantine</label>
        </div>
        <div class="control-group radio">
          <input type="radio" id="strategy-tracing" bind:group={tracing} value={true}>
          <label class="control-label" for="strategy-tracing">Extended contact tracing</label>
        </div>
        <div class="control-group slider">
          <div class="slider-container">
            <RangeSlider max={300} step={1} tooltip={tooltip} bind:values={quarantine}></RangeSlider>
          </div>
        </div>
      </section>
    {/if}

    <section class="control control-highlight">
      <div class="control-name">Shelter in place</div>
      {#if stacked}
        <div class="control-note">This overrides all interventions below</div>
      {/if}
      <div class="control-group slider">
        {#if simple}<span class="control-label">Day</span>{/if}
        <div class="slider-container">
          <RangeSlider max={300} step={1} tooltip={tooltip} bind:values={ranges["Shelter in place"]}></RangeSlider>
        </div>
      </div>
    </section>

    {#if stacked}
      <section class="control">
        <div class="control-name">Schools closed</div>
        <div class="control-group slider">
          <div class="slider-container">
            <RangeSlider max={300} step={1} tooltip={tooltip} bind:values={ranges["School closure"]}></RangeSlider>
          </div>
        </div>
      </section>

      <section class="control">
        <div class="control-name">Mass gatherings cancelled</div>
        <div class="control-group slider">
          <div class="slider-container">
            <RangeSlider max={300} step={1} tooltip={tooltip} bind:values={ranges["Cancel mass gatherings"]}></RangeSlider>
          </div>
        </div>
      </section>

      <section class="control">
        <div class="control-name">Shielding the elderly</div>
        <div class="control-group slider">
          <div class="slider-container">
            <RangeSlider max={300} step={1} tooltip={tooltip} bind:values={ranges["Shielding the elderly"]}></RangeSlider>
          </div>
        </div>
      </section>
    {/if}
  </section>
</section>
