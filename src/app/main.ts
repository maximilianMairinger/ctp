import { info, error, log, setVerbose } from "./lib/logger/logger"
import leven from "leven"
import alias from "./projectAlias"
import { Validator as JsonValidator } from "jsonschema"
import copyTemplate from "./lib/copyTemplate/copyTemplate"
import { performance } from 'perf_hooks';
import gitSetup from "./setupCL/gitSetup"
import { setDestination as setShellDestination } from "./setupCL/shell"
import * as path from "path"
import replaceDir from "./lib/interpolateDir/interpolateDir"
import at from "./lib/at/at"
import * as global from "./global"

let jsonValidator = new JsonValidator()


let wrapErr = false
export function wrapErrors(to: boolean) {
  wrapErr = to
}


type Shema = ((options: Options) => Promise<void | boolean> | void | boolean) | GenericObject

let projectIndex: {[projectKind: string]: {default: (options: Options) => Promise<void>, shema?: Shema}} = {
  module: require("./project/module/module"),
  app: require("./project/app/app")
}


export default async function(projectKind: string = "module", options: Options) {
  setVerbose(options.verbose)
  if (options.__projectKind === undefined) options.__projectKind = projectKind
  else {
    error("Invalid option \"__projectKind\" given. This is a reserved keyword.")
    error("Aborting")
    return
  }
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
  const traceError = setupTrace(projectKind, startTime)
  try {
    if (project.shema) await testShema(project.shema, options, projectName)
        
    

    

    info("Copying template \"" + projectName + "\".")
    await copyTemplate(projectName, options.destination)
    await replaceDir(at(options.destination), options)


    info("Executing in shell:")
    setShellDestination(path.resolve(options.destination))
    await gitSetup(options)

    info("")
    info("-------------")
    info("")

    await project.default(options)

    


    
    info("")
    info("")

    info("Finished project \"" + projectName + "\" after " + (Math.round((performance.now() - startTime)) / 1000) + " seconds.")
  }
  catch(e) {
    traceError(e, true)
  }
}

function setupTrace(projectKind: string, startTime: number, func: Function = error) {
  return function print(e: any, exit: boolean = false) {
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