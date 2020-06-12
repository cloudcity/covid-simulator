<script>
  export let region
  export let preset = null

  import wNumb from "wnumb"
  import RangeSlider from "./RangeSlider"
  import CovidGraph from "./CovidGraph"

  $: region = region[0].toUpperCase() + region.slice(1)
  let simple = ["1", "3"].includes(preset)
  let stacked = !simple
  let days = 180

  let compartment = "Infected"
  let tooltip = wNumb({decimals: 0, thousand: ","})

  let tracing = false
  let shelter, gathers, schools, elderly, quarantine

  switch (preset) {
    case "1":
      shelter = [21, 90]
      break
    case "3":
      shelter = [21, 60]
      break
    case "2":
    case "4":
    default:
      quarantine = [90, 180]
      shelter = [21, 90]
      schools = [21, 120]
      gathers = [21, 90]
      elderly = [21, 120]
  }

  let interventions = {}

  $: {
    if (simple) {
      interventions = { "Shelter in place": shelter }
    } else {
      interventions = {
        "Cancel mass gatherings": gathers,
        "School closure": schools,
        "Shelter in place": shelter,
        "Shielding the elderly": elderly
      }
      interventions[tracing ? "Quarantine and tracing" : "Quarantine"] = quarantine
    }
  }
</script>

<style>
  div, label, button, input {
    line-height: 1rem;
  }

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
    margin: 0;
    padding: 8px 0;
    width: 8rem;
    background-color: transparent;
    border: none;
    font-size: 15px;
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

  label.tracing:after {
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
    <CovidGraph region={region} interventions={interventions} compartment={compartment} days={days} />
  </section>

  <section class="controls">
    {#if stacked}
      <section class="control control-radio">
        <div class="control-name">Quarantine contacts on days</div>
        <div class="control-group radio">
          <label class="control-label" class:tracing={!tracing}>
            <input type="radio" bind:group={tracing} value={false}>
            Household quarantine
          </label>
        </div>
        <div class="control-group radio">
          <label class="control-label" class:tracing={tracing}>
            <input type="radio" bind:group={tracing} value={true}>
            Extended contact tracing
          </label>
        </div>
        <div class="control-group slider">
          <div class="slider-container">
            <RangeSlider max={days} step={1} tooltip={tooltip} bind:values={quarantine}></RangeSlider>
          </div>
        </div>
      </section>
    {/if}

    <section class="control control-highlight">
      <div class="control-name">Shelter in place {#if stacked}on days{/if}</div>
      {#if stacked}
        <div class="control-note">Overrides interventions below</div>
      {/if}
      <div class="control-group slider">
        {#if simple}<span class="control-label">Day</span>{/if}
        <div class="slider-container">
          <RangeSlider max={days} step={1} tooltip={tooltip} bind:values={shelter}></RangeSlider>
        </div>
      </div>
    </section>

    {#if stacked}
      <section class="control">
        <div class="control-name">Schools closed on days</div>
        <div class="control-group slider">
          <div class="slider-container">
            <RangeSlider max={days} step={1} tooltip={tooltip} bind:values={schools}></RangeSlider>
          </div>
        </div>
      </section>

      <section class="control">
        <div class="control-name">No mass gatherings on days</div>
        <div class="control-group slider">
          <div class="slider-container">
            <RangeSlider max={days} step={1} tooltip={tooltip} bind:values={gathers}></RangeSlider>
          </div>
        </div>
      </section>

      <section class="control">
        <div class="control-name">Shield the elderly on days</div>
        <div class="control-group slider">
          <div class="slider-container">
            <RangeSlider max={days} step={1} tooltip={tooltip} bind:values={elderly}></RangeSlider>
          </div>
        </div>
      </section>
    {/if}
  </section>
</section>
