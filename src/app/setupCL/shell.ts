import * as shell from "shelljs"
import { warn, error, info } from "./../lib/logger/logger"

let destinationHasBeenExplicitlySet = false

export function setDestination(destination: string) {
  destinationHasBeenExplicitlySet = true
  shell.cd(destination)
}

export function check(program: string) {
  if (!shell.which(program)) throw "Unable to use " + program + ". All commands relyent on this programm will not be executed."
}

export default function(cmd: string) {
  if (!destinationHasBeenExplicitlySet) return error("Destination has not been explicitly set")
  
  info(cmd)

  if (shell.exec(cmd, {silent: true, fatal: true}).code !== 0) {
    warn("Error while executing the following command")
    warn(cmd)
  }
}