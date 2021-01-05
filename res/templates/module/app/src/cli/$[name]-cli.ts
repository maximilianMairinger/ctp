#!/usr/bin/env node
import $[name] from "../$[name]"
import { program } from "commander"
import config from "req-package-json"


program
  .version(config.version)
  .name(config.name)

program
  .option('-s, --silent', 'silence stdout')
.parse(process.argv)


$[name](...program.args)
