import dup from "./dup"
import cwise from "cwise"

var do_unpack = cwise({
  args: ["array", "scalar", "index"],
  body: function unpackCwise(arr, a, idx) {
    var v = a, i
    for(i=0;i<idx.length-1;++i) {
      v=v[idx[i]]
    }
    v[idx[idx.length-1]]=arr
  }
})

function unpack(arr) {
  var result = dup(arr.shape)
  do_unpack(arr, result)
  return result
}

export default unpack
