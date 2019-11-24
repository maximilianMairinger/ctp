#!/usr/bin/env node

require("xrray")(Array)
import {argv as args} from 'yargs'
import { error } from "./lib/logger/logger"

import module from "./project/module/module";

let project: {[kind: string]: (destination: string, args?: any) => void} = {
  module: module,
  mod: module,
  m: module,
  

}




let projectKind = args._.first || "module"

try {
  //@ts-ignore
  project[projectKind](args.destination || "./", args)
}
catch(e) {
  error(e)
}