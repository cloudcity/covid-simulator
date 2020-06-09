<script>
  import { onDestroy, onMount } from 'svelte';
  import noUiSlider from 'nouislider';
  import wNumb from "wnumb"

  let slider = undefined;
  export let tooltip = false;
  export let min = 0;
  export let max = 100;
  export let margin = 0;
  export let values = [0];
  export let step = null;
  export let updateWhenSliding = false;

  onMount(() => {
    slider = noUiSlider.create(slider, {
      start: values,
      step,
      margin,
      behaviour: 'drag-tap',
      connect: values.length > 1,
      range: { min, max },
      tooltips: values.length === 1 ? [tooltip] : [tooltip, tooltip]
    });

    slider.on('set', onSliderValueSet)
    slider.on('slide', (values) => {
      if (updateWhenSliding) onSliderValueSet(values);
    });
  });

  function onSliderValueSet(_values) {
    values = _values.map(tooltip.from)
  }

  onDestroy(() => {
    if (!slider) return;
    slider.off();
  });
</script>

<style>
/*! nouislider - 14.5.0 - 5/11/2020 */
/* Functional styling;
 * These styles are required for noUiSlider to function.
 * You don't need to change these rules to apply your design.
 */
:global(.noUi-target),
:global(.noUi-target *) {
  -webkit-touch-callout: none;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  -webkit-user-select: none;
  -ms-touch-action: none;
  touch-action: none;
  -ms-user-select: none;
  -moz-user-select: none;
  user-select: none;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
}
:global(.noUi-target) {
  position: relative;
}
:global(.noUi-base),
:global(.noUi-connects) {
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 1;
}
/* Wrapper for all connect elements.
 */
:global(.noUi-connects) {
  overflow: hidden;
  z-index: 0;
}
:global(.noUi-connect),
:global(.noUi-origin) {
  will-change: transform;
  position: absolute;
  z-index: 1;
  top: 0;
  right: 0;
  -ms-transform-origin: 0 0;
  -webkit-transform-origin: 0 0;
  -webkit-transform-style: preserve-3d;
  transform-origin: 0 0;
  transform-style: flat;
}
:global(.noUi-connect) {
  height: 100%;
  width: 100%;
}
:global(.noUi-origin) {
  height: 10%;
  width: 10%;
}
/* Give origins 0 height/width so they don't interfere with clicking the
 * connect elements.
 */
:global(.noUi-horizontal .noUi-origin) {
  height: 0;
}
:global(.noUi-handle) {
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  position: absolute;
}
:global(.noUi-touch-area) {
  height: 100%;
  width: 100%;
}
:global(.noUi-state-tap .noUi-connect),
:global(.noUi-state-tap .noUi-origin) {
  -webkit-transition: transform 0.3s;
  transition: transform 0.3s;
}
:global(.noUi-state-drag *) {
  cursor: inherit !important;
}
/* Slider size and handle placement;
 */
:global(.noUi-horizontal) {
  height: 5px;
}
:global(.noUi-horizontal .noUi-handle) {
  width: 19px;
  height: 19px;
  right: -8px;
  top: -8px;
  border-radius: 50px;
}
:global(.noUi-txt-dir-rtl.noUi-horizontal .noUi-handle) {
  left: -17px;
  right: auto;
}
/* Styling;
 * Giving the connect element a border radius causes issues with using transform: scale
 */
:global(.noUi-target) {
  background: #D5D5DE;
  border-radius: 4px;
}
:global(.noUi-connect) {
  background: #F79636;
}
/* Handles and cursors;
 */
:global(.noUi-draggable) {
  cursor: ew-resize;
}
:global(.noUi-handle) {
  border-radius: 3px;
  background: #D35C08;
  cursor: default;
  outline: 0;
}
:global(.noUi-active) {
  background: #F79636;
}
:global(.noUi-active:focus) {
  outline: 0;
}
:global(.noUi-handle:after) {
  left: 17px;
}
:global(.noUi-tooltip) {
  display: block;
  position: absolute;
  color: #D35C08;
  padding: 0;
  text-align: center;
  white-space: nowrap;
}
:global(.noUi-horizontal .noUi-tooltip) {
  -webkit-transform: translate(-50%, 0);
  transform: translate(-50%, 0);
  left: 50%;
  bottom: 100%;
}
:global(.noUi-horizontal .noUi-origin > .noUi-tooltip) {
  -webkit-transform: translate(50%, 0);
  transform: translate(50%, 0);
  left: auto;
  bottom: 10px;
}
</style>

<div class="rangeSlider" bind:this={slider}></div>
