import { info, log, warn } from "./../../lib/logger/logger"
import replace from "./../../lib/replaceFromFile/replaceFromFile"
import setupAt from "./../../lib/at/at"





export default async function(options: Options) {
  let at = setupAt(options.destination)


  replace(at("test/src/test.ts"), {name: options.name})  
}