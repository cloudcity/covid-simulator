function g(a,b,e){var c=a[e]|0;if(c<=0)return[];var f=new Array(c),d;if(e===a.length-1)for(d=0;d<c;++d)f[d]=b;else for(d=0;d<c;++d)f[d]=g(a,b,e+1);return f}function h(a,b){var e,c;for(e=new Array(a),c=0;c<a;++c)e[c]=b;return e}function i(a,b){typeof b==="undefined"&&(b=0);switch(typeof a){case"number":if(a>0)return h(a|0,b);break;case"object":if(typeof a.length==="number")return g(a,b,0);break}return[]}export default i;
