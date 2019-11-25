import { info, log, warn } from "./../../lib/logger/logger"
import * as fs from "fs"
import template from "../../lib/copyTemplate/copyTemplate"



export default async function(options: Options) {
  await template("module", options.destination)

  
}