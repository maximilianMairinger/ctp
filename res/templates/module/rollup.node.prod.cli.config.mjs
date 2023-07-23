import { merge } from "webpack-merge"
import commonMod from "./rollup.node.common.config.mjs"


export default merge(commonMod, {
  input: 'app/src/cli/$[name]-cli.ts',
  output: {
    file: 'app/dist/cjs/cli/$[name]-cli.js',
    format: 'cjs'
  },
})