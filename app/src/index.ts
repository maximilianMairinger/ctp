require("xrray")(Array)
import { error } from "./lib/logger/logger"


import module from "./project/module/module";

let project: {[kind: string]: (options: Options) => void} = {
  module: module,
  mod: module,
  m: module,
  

}


export default function(projectKind: string = "module", options: Options) {
  try {
    project[projectKind](options)
  }
  catch(e) {
    error(e)
  }
}