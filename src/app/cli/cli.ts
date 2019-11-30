#!/usr/bin/env node

import main, { wrapErrors } from "../index"
import {argv as args} from 'yargs'
import { setVerbose } from "../lib/logger/logger"
import alias from "./../projectAlias"
import inq from "./inquery/inq"
import { log, error } from "./../lib/logger/logger"
import * as path from "path"
require("xrray")(Array)

wrapErrors(true);


import generalInquery from "./generalInquery"

//@ts-ignore
setVerbose(args.v || args.verbose)


let projectKind = args._.first || "module"

args.destination = args.destination || "./"

let options: any = {destination: args.destination || "./", ...args}
delete options._
delete options["$0"]
delete options.v
delete options.verbose


projectKind = alias[projectKind]

let inqueryIndex = {
  module: require("./inquery/module/module").default
};


(async () => {
  options = await inq(generalInquery, options)
  options = await inq(inqueryIndex[projectKind], options)
  if (!(await inq({name: "sure", message: "The template will now be generated at \"" + path.resolve(options.destination) + "\". Are you sure?", type: "confirm"}))) {
    return error("Aborting")
  }
  console.log("\n")

  await main(projectKind, options)
})()



