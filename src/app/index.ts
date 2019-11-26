require("xrray")(Array)
import { info, error } from "./lib/logger/logger"
import leven from "leven"
import alias from "./projectAlias"


import module from "./project/module/module";

let projectIndex: {[kind: string]: (options: Options) => Promise<void>} = {
  module: module,

}


export default async function(projectKind: string = "module", options: Options) {
  let p = alias[projectKind]
  if (p === undefined) {
    error("Unknown project \"" + projectKind + "\". Did you mean: ... ?")
    let close = []

    let barrier = 3
    let aliases = Object.keys(alias)
    aliases.ea((e) => {
      if (leven(e, projectKind) <= barrier) close.add(e)
    })


    let s = ""
    close.ea((e, i) => {
      
      if ((i + 1) % 3 === 0) s += e + "\n\t " 
      else s += e + "\t\t"
    })
    error("")
    error(s)

    return 
  }

  info("Starting project \"" + p + "\" with the following options: ", options)
  try {
    
    await projectIndex[p](options)
  }
  catch(e) {
    error(e.message || "Unknown")
  }
}