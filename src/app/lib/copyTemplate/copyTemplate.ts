import * as path from "path"
import * as fs from "fs"
import * as copydir from "copy-dir"
import { log } from "../logger/logger"

let resDir = path.join(__dirname, "../../../res/templates")



export default function(which: string, to: string) {
  return new Promise((res, rej) => {
    fs.readdir(resDir, (err, ls) => {
      if (err) return rej(err)
      if (ls.includes(which)) {
        let from = path.join(resDir, which)
        copydir(from, to, {}, () => {
          log("DONE")
        });

      }
      else rej("Trying to copy invalid template: \"" + which + "\". Cannot be found in " + ls.toString())
      
    })
  })
  
}