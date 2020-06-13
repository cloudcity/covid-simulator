<script>
  export let region
  export let preset = null

  import { fade } from "svelte/transition"
  import wNumb from "wnumb"
  import RangeSlider from "./RangeSlider"
  import CovidGraph from "./CovidGraph"

  $: region = region[0].toUpperCase() + region.slice(1)
  let days = 180

  let compartment = "Infected"
  let tooltip = wNumb({decimals: 0, thousand: ","})

  let tracing = false
  let simple, shelter, gathers, schools, elderly, quarantine

  switch (preset) {
    case "shelter-only":
      simple = false
      quarantine = [0,0]
      shelter = [0,60]
      schools = [0,0]
      gathers = [0,0]
      elderly = [0,0]
      break
    case "shelter-plus":
      simple = false
      quarantine = [0,0]
      shelter = [0,60]
      schools = [0,60]
      gathers = [0,60]
      elderly = [0,60]
      break
    case "none":
      simple = false
      quarantine = [0,0]
      shelter = [0,0]
      schools = [0,0]
      gathers = [0,0]
      elderly = [0,0]
      break
    case "elderly":
      simple = false
      quarantine = [0,0]
      shelter = [0,0]
      schools = [0,0]
      gathers = [0,0]
      elderly = [0,180]
      break
    case "schools":
      simple = false
      quarantine = [0,0]
      shelter = [0,0]
      schools = [0,180]
      gathers = [0,0]
      elderly = [0,0]
      break
    case "1":
      simple = true
      shelter = [21, 90]
      break
    case "3":
      simple = true
      shelter = [21, 60]
      break
    case "2":
    case "4":
    case "5":
    default:
      simple = false
      quarantine = [90, 180]
      shelter = [21, 90]
      schools = [21, 120]
      gathers = [21, 90]
      elderly = [21, 120]
  }
  let stacked = !simple

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

  let explain = false
  let showExplanation = (e) => {
    if (explain) { return explain = false }

    let control = e.target.parentElement
    explain = {
      name: control.querySelector(".control-name").innerHTML,
      body: control.querySelector(".control-explanation").innerHTML,
    }
  }
</script>

<style>
  div, label, button, input {
    line-height: 1rem;
  }

  .covid-simulator {
    position: relative;
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

  .control {
    position: relative;
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
    flex-flow: column nowrap;
    font-size: 15px;
    justify-content: center;
    position: relative;
  }

  .stacked .explain {
    position: absolute;
    background: #FFFFFF;
    z-index: 10;
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    top: 0;
    height: 100%;
    padding: 0 15%;
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

  .control-arrow {
    width: 10px;
    height: 10px;
    background-color: grey;
    position: absolute;
    top: 28px;
    right: 15px;
    transform: translate(-50%, -50%) rotate(45deg);
  }

  .control-arrow:after {
    content: "";
    width: 100%;
    height: 100%;
    background-color: #fff;
    position: absolute;
    left: -1px;
    top: 1px;
  }

  .explain .control-name {
    margin-bottom: 20px;
  }

  .control-explanation {
    display: none;
  }

  .explain .control-explanation {
    display: block;
    color: #807F8B;
    font-size: 13px;
    line-height: 150%;
  }

  .explain .control-explanation a {
    color: #D35C08;
  }

  .explain button {
    width: auto;
    margin: 1.5em auto;
    padding: 1em 1.5em;
    border-radius: 25px;
    border: 0;
    color: #FFFFFF;
    background-color: #D35C08;
    font-size: 15px;
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
    {#if explain}
      <section class="explain" transition:fade>
        <div class="control-name">{@html explain.name}</div>
        <div class="control-explanation">{@html explain.body}</div>
        <button class="explain-back" on:click={showExplanation}>Back</button>
      </section>
    {/if}

    {#if stacked}
      <section class="control control-radio">
        <div class="control-name">Quarantine contacts on days</div>
        <div class="control-arrow" on:click={showExplanation}></div>
        <div class="control-explanation">
          Control of COVID-19 requires the effective testing and isolation and quarantine of contacts. Users should determine whether a household quarantine strategy will be adopted (lower resource intensity; we assume 37% reduction in transmission) or an extended contact tracing strategy and quarantine of all extended contacts will be used (higher resource intensity; we assume 52% reduction in transmission. (<a href="https://cmmid.github.io/topics/covid19/reports/bbc_contact_tracing.pdf" target="_blank">Reference</a>)
        </div>
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
        <div class="control-arrow" on:click={showExplanation}></div>
        <div class="control-explanation">
          Community acceptance may be stronger if alternative services for childcare and student learning and provision of nutrition are established. We assumed a reduction in transmission by 18%, although results in various settings vary. (<a href="https://www.thelancet.com/action/showPdf?pii=S2352-4642%2820%2930095-X" target="_blank">Reference</a>)
        </div>
        <div class="control-group slider">
          <div class="slider-container">
            <RangeSlider max={days} step={1} tooltip={tooltip} bind:values={schools}></RangeSlider>
          </div>
        </div>
      </section>

      <section class="control">
        <div class="control-name">No mass gatherings on days</div>
        <div class="control-arrow" on:click={showExplanation}></div>
        <div class="control-explanation">
          Engage with community and religious leaders to articulate value-based decisions and encourage local adoption. Adaptation of existing events, including outdoor services or services in shifts, may be helpful in localities where cancellation of gatherings is not practical. We assumed a reduction in transmission by 28%. (<a href="https://www.pnas.org/content/104/18/7588" target="_blank">Reference</a>)
        </div>
        <div class="control-group slider">
          <div class="slider-container">
            <RangeSlider max={days} step={1} tooltip={tooltip} bind:values={gathers}></RangeSlider>
          </div>
        </div>
      </section>

      <section class="control">
        <div class="control-name">Shield the elderly on days</div>
        <div class="control-arrow" on:click={showExplanation}></div>
        <div class="control-explanation">
          While there is a limited evidence base for a “shielding” strategy, such an approach might be of benefit to certain at-risk groups for severe outcomes. We assumed a reduction in transmission among the elderly cohort and their contacts of 50%. (<a href="https://www.imperial.ac.uk/media/imperial-college/medicine/sph/ide/gida-fellowships/Imperial-College-COVID19-NPI-modelling-16-03-2020.pdf" target="_blank">Reference</a>)
        </div>
        <div class="control-group slider">
          <div class="slider-container">
            <RangeSlider max={days} step={1} tooltip={tooltip} bind:values={elderly}></RangeSlider>
          </div>
        </div>
      </section>

    {/if}
  </section>
</section>
