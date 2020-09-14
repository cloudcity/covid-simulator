import ndarray from "../web_modules/ndarray.js"

import dup from "./dup.js"
import ops from "./ops.js"
import pack from './pack.js'
import unpack from "./unpack.js"
import zeros from "./zeros.js"

let numjs = {
  array: ndarray,
  dup: dup,
  muleq: ops.muleq,
  mulseq: ops.mulseq,
  pack: pack,
  sum: ops.sum,
  unpack: unpack,
  zeros: zeros,
}

export default numjs
