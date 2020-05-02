#!/usr/bin/env node

import main, { wrapErrors } from "../main"
import {argv as args} from 'yargs'
import alias from "./../projectAlias"
import inq from "./inquery/inq"
import { log, error, setTestEnv } from "./../lib/logger/logger"
import * as path from "path"
import xrray from "xrray"
xrray(Array)



wrapErrors(true);


import generalInquery from "./generalInquery"
import { setOptions } from "./lib/lib"

//@ts-ignore
let verb: boolean = args.v === undefined && args.verbose === undefined ? true : args.v === undefined ? args.verbose : args.v



let projectKind = args._.first || "module"

//@ts-ignore
args.destination = path.resolve(args.destination || "./")


//@ts-ignore
let options: any = {destination: path.resolve(args.destination || "./"), ...args}
delete options._
delete options["$0"]
delete options.v
options.verbose = verb


projectKind = alias[projectKind]

let inqueryIndex = {
  module: require("./inquery/module/module"),
  app: require("./inquery/app/app")
};

setOptions(options);
console.log("set", options);

(async () => {
  options = await inq(inqueryIndex[projectKind].pre, options)
  options = await inq(generalInquery, options)
  options = await inq(inqueryIndex[projectKind].post, options)
  if (!(await inq({name: "sure", message: "The template will now be generated at \"" + path.resolve(options.destination) + "\". Are you sure?", type: "confirm"}, options))) {
    return log("Aborting")
  }
  console.log("\n")


  

  await main(projectKind, options)
})()



