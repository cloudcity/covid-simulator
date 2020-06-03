import dup from "./dup"
import compiler from "./compiler"

var do_unpack = compiler({"args":["array","scalar","index"],"pre":{"body":"{}","args":[],"thisVars":[],"localVars":[]},"body":{"body":"{\n    var _inline_4_v = _inline_4_arg1_, _inline_4_i;\n    for (_inline_4_i = 0; _inline_4_i < _inline_4_arg2_.length - 1; ++_inline_4_i) {\n      _inline_4_v = _inline_4_v[_inline_4_arg2_[_inline_4_i]];\n    }\n    _inline_4_v[_inline_4_arg2_[_inline_4_arg2_.length - 1]] = _inline_4_arg0_;\n  }","args":[{"name":"_inline_4_arg0_","lvalue":false,"rvalue":true,"count":1},{"name":"_inline_4_arg1_","lvalue":false,"rvalue":true,"count":1},{"name":"_inline_4_arg2_","lvalue":false,"rvalue":true,"count":4}],"thisVars":[],"localVars":["_inline_4_i","_inline_4_v"]},"post":{"body":"{}","args":[],"thisVars":[],"localVars":[]},"debug":false,"funcName":"unpackCwise","blockSize":64})

function unpack(arr) {
  var result = dup(arr.shape)
  do_unpack(arr, result)
  return result
}

export default unpack
