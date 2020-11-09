import __SNOWPACK_ENV__ from '../__snowpack__/env.js';
import.meta.env = __SNOWPACK_ENV__;

import CovidSimulator from "./CovidSimulator.js"

let apps = []
let observers = []

const updateProps = function(app) {
  return function(mutationsList, observer) {
    mutationsList.forEach(m => {
      if (m.type === "attributes") {
        app.$set({
          region: m.target.dataset.region,
          preset: m.target.dataset.preset,
        })
      }
    })
  }
};

function createApps(cs) {
  document.querySelectorAll("[data-covid-graph]").forEach(e => {
    let app = new cs({target: e, props: {
      region: e.dataset.region,
      preset: e.dataset.preset,
    }})
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
