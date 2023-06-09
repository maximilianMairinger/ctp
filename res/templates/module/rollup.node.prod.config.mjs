import { merge } from "webpack-merge"
import commonMod from "./rollup.node.common.config.mjs"


export default merge(commonMod, {
  input: 'app/src/$[name].ts',
  output: {
    file: 'dist/cjs/$[name].js',
    format: 'cjs'
  },
})