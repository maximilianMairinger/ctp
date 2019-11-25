#!/usr/bin/env node

import main from "./index"
import {argv as args} from 'yargs'
import { setVerbose } from "./lib/logger/logger"

//@ts-ignore
setVerbose(args.v || args.verbose)


let projectKind = args._.first || "module"

args.destination = args.destination || "./"

let options = {destination: args.destination || "./", ...args}
delete options._
delete options["$0"]
//@ts-ignore
delete options.v
//@ts-ignore
delete options.verbose

//@ts-ignore
main(projectKind, options)
