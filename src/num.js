import ndarray from "ndarray"

import dup from "./dup"
import ops from "./ops"
import pack from './pack'
import unpack from "./unpack"
import zeros from "./zeros"

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
