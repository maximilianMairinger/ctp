import { info, log, warn } from "./../../lib/logger/logger"
import replaceDir from "./../../lib/replaceDir/replaceDir"
import setupAt from "./../../lib/at/at"





export default async function(options: Options) {
  let at = setupAt(options.destination)

  await replaceDir(at, options)



}


