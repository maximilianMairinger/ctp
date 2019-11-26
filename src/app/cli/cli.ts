#!/usr/bin/env node

import main from "../index"
import {argv as args} from 'yargs'
import { setVerbose } from "../lib/logger/logger"
import alias from "./../projectAlias"
import inq from "./inq"

import moduleInq from "./inquery/module/module"

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
  module: moduleInq
};


(async () => {
  await inq(inqueryIndex[projectKind], options)

  await main(projectKind, options)
})()



