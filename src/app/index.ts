require("xrray")(Array)
import { info, error } from "./lib/logger/logger"
import leven from "leven"
import alias from "./projectAlias"
import { Validator } from "jsonschema"
import copyTemplate from "./lib/copyTemplate/copyTemplate"

let v = new Validator()




type Shema = ((options: Options) => Promise<void | boolean> | void | boolean) | GenericObject

let projectIndex: {[projectKind: string]: {project: (options: Options) => Promise<void>, shema?: Shema}} = {
  module: {
    project: require("./project/module/module").default,
    //shema:   require("./project/module/optionsShema").default
  },


}


export default async function(projectKind: string = "module", options: Options) {
  let projectName = alias[projectKind]
  if (projectName === undefined) {
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

  info("Starting project \"" + projectName + "\" with the following options: ", options)

  let project = projectIndex[projectName]
  try {
    if (project.shema) await testShema(project.shema, options, projectName)
    
    await copyTemplate(projectName, options.destination)
    await project.project(options)
  }
  catch(e) {
    if (!(e instanceof Error)) e = new Error(e)

    error(e.message || "Unknown")
  }
}

async function testShema(val: Shema, options: Options, projectName: string) {
  if (typeof val === "function") {
    if (!(await val(options))) throw "Options did not match shema for " + projectName + "."
  }
  else {
    let { errors } = v.validate(options, val)
    if  ( errors ) throw errors
  }
}