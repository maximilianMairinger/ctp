import { info, log, warn } from "./../../lib/logger/logger"
import * as fs from "fs"
import template from "../../lib/copyTemplate/copyTemplate"



export default function(options: Options) {
  template("module", options.destination)
}