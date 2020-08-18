import a from"../web_modules/ndarray.js";import l from"./compiler.js";var o=l({args:["array","scalar","index"],pre:{body:"{}",args:[],thisVars:[],localVars:[]},body:{body:`{
var _inline_1_v=_inline_1_arg1_,_inline_1_i
for(_inline_1_i=0;_inline_1_i<_inline_1_arg2_.length-1;++_inline_1_i) {
_inline_1_v=_inline_1_v[_inline_1_arg2_[_inline_1_i]]
}
_inline_1_arg0_=_inline_1_v[_inline_1_arg2_[_inline_1_arg2_.length-1]]
}`,args:[{name:"_inline_1_arg0_",lvalue:!0,rvalue:!1,count:1},{name:"_inline_1_arg1_",lvalue:!1,rvalue:!0,count:1},{name:"_inline_1_arg2_",lvalue:!1,rvalue:!0,count:4}],thisVars:[],localVars:["_inline_1_i","_inline_1_v"]},post:{body:"{}",args:[],thisVars:[],localVars:[]},funcName:"convert",blockSize:64});function t(e,n){for(var i=[],_=e,r=1;Array.isArray(_);)i.push(_.length),r*=_.length,_=_[0];return i.length===0?a():(n||(n=a(new Float64Array(r),i)),o(n,e),n)}export default t;
