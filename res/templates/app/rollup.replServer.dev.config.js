import merge from "webpack-merge"
import commonMod from "./rollup.replServer.common.config"


export default merge(commonMod, {
  watch: {
    include: 'replServer/src/**',
    exclude: 'node_modules/**'
  }
})
