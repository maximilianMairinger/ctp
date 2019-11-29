import { info, log, warn } from "./../../lib/logger/logger"
import { promises as fs } from "fs"
import * as path from "path"



function setUpFrom(destination: string) {
  return function from(...from) {
    return path.join(destination, ...from)
  }
}




export default async function(options: Options) {
  const from = setUpFrom(options.destination)

  let s = (await fs.readFile(from("test/src/test.ts"))).toString(); 

  console.log(s);
  
  
}