
const code = ".covid-graph-container.svelte-1okghyu.svelte-1okghyu{position:relative;background-color:#F7F7F8;padding:2rem 2rem 1rem 2rem;display:flex;flex-wrap:wrap;justify-content:flex-end}.covid-graph-vega.svelte-1okghyu.svelte-1okghyu{width:92%}.numbers.svelte-1okghyu.svelte-1okghyu{clear:both;display:flex;flex-wrap:wrap;justify-content:flex-end;max-width:45rem}.numbers.svelte-1okghyu p.svelte-1okghyu{padding:0.5rem 1.2rem;text-align:center;font-size:13px;color:#807F8B;flex-grow:1}.numbers.svelte-1okghyu p .big.svelte-1okghyu{display:block;font-size:20px;color:#4A495B}.numbers.svelte-1okghyu .total.svelte-1okghyu{background-color:#FFFFFF}.footnote.svelte-1okghyu.svelte-1okghyu{font-size:12px;margin-top:-10px;z-index:10;line-height:1em}";

const styleEl = document.createElement("style");
const codeEl = document.createTextNode(code);
styleEl.type = 'text/css';

styleEl.appendChild(codeEl);
document.head.appendChild(styleEl);