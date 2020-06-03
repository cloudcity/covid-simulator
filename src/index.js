import CovidSimulator from "./covid-simulator.js"

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-covid-graph]").forEach(e => {
    new CovidSimulator(e)
  })
})
