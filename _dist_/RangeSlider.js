import"./RangeSlider.css.proxy.js";import{SvelteComponent as q,attr as r,binding_callbacks as s,detach as t,element as u,init as v,insert as w,noop as j,safe_not_equal as x}from"../web_modules/svelte/internal.js";import{onDestroy as y,onMount as z}from"../web_modules/svelte.js";import A from"../web_modules/nouislider.js";import"../web_modules/wnumb.js";function B(d){let b;return{c(){b=u("div"),r(b,"class","rangeSlider")},m(c,e){w(c,b,e),d[11](b)},p:j,i:j,o:j,d(c){c&&t(b),d[11](null)}}}function C(d,b,c){let e,f,{tooltip:g=!1}=b,{min:k=0}=b,{max:l=100}=b,{margin:m=0}=b,{values:h=[0]}=b,{step:n=null}=b,{updateWhenSliding:o=!1}=b,{disabled:i=!1}=b;z(()=>{e=A.create(f,{start:h,step:n,margin:m,behaviour:"drag-tap",connect:h.length>1,range:{min:k,max:l},tooltips:h.length===1?[g]:[g,g]}),i&&f.setAttribute("disabled",!0),e.on("set",p),e.on("slide",a=>{o&&p(a)})});function p(a){c(1,h=a.map(g.from))}y(()=>{if(!e)return;e.off()});function E(a){s[a?"unshift":"push"](()=>{c(0,f=a)})}return d.$set=a=>{"tooltip"in a&&c(2,g=a.tooltip),"min"in a&&c(3,k=a.min),"max"in a&&c(4,l=a.max),"margin"in a&&c(5,m=a.margin),"values"in a&&c(1,h=a.values),"step"in a&&c(6,n=a.step),"updateWhenSliding"in a&&c(7,o=a.updateWhenSliding),"disabled"in a&&c(8,i=a.disabled)},d.$$.update=()=>{if(d.$$.dirty&257){F:f&&(i?f.setAttribute("disabled",!0):f.removeAttribute("disabled"))}},[f,h,g,k,l,m,n,o,i,e,p,E]}class D extends q{constructor(d){super();v(this,d,C,B,x,{tooltip:2,min:3,max:4,margin:5,values:1,step:6,updateWhenSliding:7,disabled:8})}}export default D;
