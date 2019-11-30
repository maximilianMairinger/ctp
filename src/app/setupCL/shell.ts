import * as shell from "shelljs"
import { error, info } from "./../lib/logger/logger"

let destinationHasBeenExplicitlySet = false

export function setDestination(destination: string) {
  destinationHasBeenExplicitlySet = true
  shell.cd(destination)
}

export default function(cmd: string) {
  if (!destinationHasBeenExplicitlySet) return error("Destination has not been explicitly set")
  
  info(cmd)

  if (shell.exec(cmd, {silent: true, fatal: true}).code !== 0) {
    error("Error while executing the following command")
    error(cmd)
  }
}