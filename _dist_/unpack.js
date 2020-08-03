import c from"./dup.js";import d from"./compiler.js";var e=d({args:["array","scalar","index"],pre:{body:"{}",args:[],thisVars:[],localVars:[]},body:{body:`{
    var _inline_4_v = _inline_4_arg1_, _inline_4_i;
    for (_inline_4_i = 0; _inline_4_i < _inline_4_arg2_.length - 1; ++_inline_4_i) {
      _inline_4_v = _inline_4_v[_inline_4_arg2_[_inline_4_i]];
    }
    _inline_4_v[_inline_4_arg2_[_inline_4_arg2_.length - 1]] = _inline_4_arg0_;
  }`,args:[{name:"_inline_4_arg0_",lvalue:!1,rvalue:!0,count:1},{name:"_inline_4_arg1_",lvalue:!1,rvalue:!0,count:1},{name:"_inline_4_arg2_",lvalue:!1,rvalue:!0,count:4}],thisVars:[],localVars:["_inline_4_i","_inline_4_v"]},post:{body:"{}",args:[],thisVars:[],localVars:[]},debug:!1,funcName:"unpackCwise",blockSize:64});function f(a){var b=c(a.shape);return e(a,b),b}export default f;
