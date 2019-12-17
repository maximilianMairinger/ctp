require("xrray")(Array)
import { info, error, log } from "./lib/logger/logger"
import leven from "leven"
import alias from "./projectAlias"
import { Validator as JsonValidator } from "jsonschema"
import copyTemplate from "./lib/copyTemplate/copyTemplate"
import { performance } from 'perf_hooks';
import prepOptions from "./prepOptions"
import npmSetup from "./setupCL/npmSetup"
import gitSetup from "./setupCL/gitSetup"
import { setDestination as setShellDestination } from "./setupCL/shell"
import * as path from "path"

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
  const printError = setUpPrintError(projectKind, startTime)
  const printLog = setUpPrintError(projectKind, startTime, log)
  try {
    if (project.shema) await testShema(project.shema, options, projectName)
    
    
    prepOptions(options)
    let printOptions = JSON.parse(JSON.stringify(options))
    delete printOptions.githubPassword
    info("Starting project \"" + projectName + "\" with the following options: ", printOptions)

    return

    await copyTemplate(projectName, options.destination)
    await project.project(options)

    setShellDestination(path.resolve(options.destination))
    info("Executing the following shell command:")
    try {
      await npmSetup(options)
    }
    catch(e) {
      printLog(e)
    }

    try {
      await gitSetup(options)
    }
    catch(e) {
      printLog(e)
    }
    
    info("")
    info("")

    info("Finished project \"" + projectName + "\" after " + (Math.round((performance.now() - startTime)) / 1000) + " seconds.")
  }
  catch(e) {
    printError(e, true)
  }
}

function setUpPrintError(projectKind: string, startTime: number, func: Function = error) {
  return function printError(e: any, exit: boolean = false) {
    if (wrapErr) {
      if (e instanceof Error && e.message === undefined) e.message = "Unknown"
  
      func(e)
      if (exit) func("Exiting \"ctp " + projectKind + "\" after " + (Math.round((performance.now() - startTime)) / 100) + " seconds.")
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