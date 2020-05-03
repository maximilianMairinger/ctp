import * as shell from "shelljs"
import { warn, error, info } from "./../lib/logger/logger"

let destinationHasBeenExplicitlySet = false

export function setDestination(destination: string) {
  destinationHasBeenExplicitlySet = true
  shell.cd(destination)
}

export function check(program: string) {
  if (!shell.which(program)) throw "Unable to use " + program + ". All commands reliant on this programm will not be executed."
}

export default function(cmd: string) {
  if (!destinationHasBeenExplicitlySet) return error("Destination has not been explicitly set")
  
  info(`shell: ${cmd}`)

  let res = shell.exec(cmd, {silent: true, fatal: true})

  if (res.code !== 0) {
    warn("Error while executing the command above")
    info("Stacktrace:")
    info(res.stderr)
  }
}