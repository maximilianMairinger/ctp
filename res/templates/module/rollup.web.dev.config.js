import merge from "webpack-merge"
import commonMod from "./rollup.web.common.config"


export default merge(commonMod, {
  watch: {
    include: ['app/src/**', "test/src/**"],
    exclude: 'node_modules/**'
  }
})
