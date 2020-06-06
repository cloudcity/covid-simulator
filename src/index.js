import CovidSimulator from "./CovidSimulator.svelte"

let apps = []
let observers = []

const updateProps = function(app) {
  return function(mutationsList, observer) {
    mutationsList.forEach(m => {
      if (m.type === "attributes" && m.attributeName === "data-region") {
        app.$set({region: m.target.dataset.region})
      }
    })
  }
};

function createApps(cs) {
  document.querySelectorAll("[data-covid-graph]").forEach(e => {
    let app = new cs({target: e, props: e.dataset})
    apps.push(app)

    let observer = new MutationObserver(updateProps(app))
    observer.observe(e, {attributes: true})
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
    observers.forEach(o => o.disconnect())
  });
}
