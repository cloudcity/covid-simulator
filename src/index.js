import CovidSimulator from "./CovidSimulator.svelte"

let apps = [];

function createApps(cs) {
  document.querySelectorAll("[data-covid-graph]").forEach(e => {
    apps.push(new cs({target: e, props: e.dataset}))
  })
}

document.addEventListener("DOMContentLoaded", () => createApps(CovidSimulator))

export default apps

if (import.meta.hot) {
  import.meta.hot.accept(({module}) => {
    createApps(module)
  });
  import.meta.hot.dispose(() => {
    apps.forEach(a => a.$destroy())
  });
}
