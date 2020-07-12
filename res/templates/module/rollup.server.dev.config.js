import merge from "webpack-merge"
import commonMod from "./rollup.server.common.config"


// not in use

export default merge(commonMod, {
  watch: {
    include: ['app/src/**', "repl/src/**"],
    exclude: 'node_modules/**'
  }
})
