<script>
  export let covidGraph
  export let region
  import CovidSimulator from "./covid-simulator"

  const capitalize = ws => ws.split(' ').map(w => w[0].toUpperCase()+ w.substring(1)).join(' ')
</script>

<div class="covid-simulator">
  <h1>{capitalize(region)}</h1>
</div>
