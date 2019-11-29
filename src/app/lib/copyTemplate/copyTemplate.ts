import * as path from "path"
import * as fs from "fs"
import * as copydir from "copy-dir"
import { log } from "../logger/logger"

let resDir = path.join(__dirname, "../../../../res/templates")


export default function(which: string, to: string) {
  return new Promise<void>((res, rej) => {
    fs.readdir(resDir, (err, ls) => {
      if (err) return rej(err)
      if (ls.includes(which)) {
        let from = path.join(resDir, which)
        copydir(from, to, {}, (err) => {
          if (err) return rej(err)
          res()
        });

      }
      else rej("Trying to copy invalid template: \"" + which + "\". Cannot be found in " + ls.toString())
      
    })
  })
  
}