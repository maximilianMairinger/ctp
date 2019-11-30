require("xrray")(Array)
import { info, error, log } from "./lib/logger/logger"
import leven from "leven"
import alias from "./projectAlias"
import { Validator as JsonValidator } from "jsonschema"
import copyTemplate from "./lib/copyTemplate/copyTemplate"
import { performance } from 'perf_hooks';
import prepOptions from "./prepOptions"

let jsonValidator = new JsonValidator()


let wrapErr = false
export function wrapErrors(to: boolean) {
  wrapErr = to
}


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

  let startTime = performance.now()
  let project = projectIndex[projectName]
  try {
    if (project.shema) await testShema(project.shema, options, projectName)

    
    
    prepOptions(options)
    info("Starting project \"" + projectName + "\" with the following options: ", options)
    
    await copyTemplate(projectName, options.destination)
    await project.project(options)

    

    info("Finished project \"" + projectName + "\" after " + (Math.round((performance.now() - startTime)) / 1000) + " seconds.")
  }
  catch(e) {
    if (wrapErr) {
      if (!(e instanceof Error)) e = new Error(e)

      error(e.message || "Unknown")
      error("Exiting \"ctp " + projectKind + "\" after " + (Math.round((performance.now() - startTime)) / 1000) + " seconds.")
    }
    else throw e
  }
}

async function testShema(val: Shema, options: Options, projectName: string) {
  if (typeof val === "function") {
    if (!(await val(options))) throw "Options did not match shema for " + projectName + "."
  }
  else {
    let { errors } = jsonValidator.validate(options, val)
    if  ( errors ) throw errors
  }
}