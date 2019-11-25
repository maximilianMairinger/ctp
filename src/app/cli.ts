#!/usr/bin/env node

import main from "./index"
import {argv as args} from 'yargs'


let projectKind = args._.first || "module"

args.destination = args.destination || "./"

let options = {destination: args.destination || "./", ...args}
delete options._
delete options["$0"]

//@ts-ignore
main(projectKind, options)
