import d from"../web_modules/ndarray.js";import g from"./compiler.js";var h=g({args:["array","scalar","index"],pre:{body:"{}",args:[],thisVars:[],localVars:[]},body:{body:`{
var _inline_1_v=_inline_1_arg1_,_inline_1_i
for(_inline_1_i=0;_inline_1_i<_inline_1_arg2_.length-1;++_inline_1_i) {
_inline_1_v=_inline_1_v[_inline_1_arg2_[_inline_1_i]]
}
_inline_1_arg0_=_inline_1_v[_inline_1_arg2_[_inline_1_arg2_.length-1]]
}`,args:[{name:"_inline_1_arg0_",lvalue:!0,rvalue:!1,count:1},{name:"_inline_1_arg1_",lvalue:!1,rvalue:!0,count:1},{name:"_inline_1_arg2_",lvalue:!1,rvalue:!0,count:4}],thisVars:[],localVars:["_inline_1_i","_inline_1_v"]},post:{body:"{}",args:[],thisVars:[],localVars:[]},funcName:"convert",blockSize:64});function i(e,b){for(var c=[],a=e,f=1;Array.isArray(a);)c.push(a.length),f*=a.length,a=a[0];return c.length===0?d():(b||(b=d(new Float64Array(f),c)),h(b,e),b)}export default i;
