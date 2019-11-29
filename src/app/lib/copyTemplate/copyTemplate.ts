import * as path from "path"
import { promises as fs } from "fs"
import { log } from "../logger/logger"
import * as copy from "recursive-copy"

let resDir = path.join(__dirname, "../../../../res/templates")


export default async function(which: string, destination: string) {
  let fileExists: boolean
  try {
    await fs.stat(destination)
    fileExists = true
  }
  catch(e) {
    // If not "file dosent exisit error" throw
    if (e.code !== "ENOENT") throw e
    fileExists = false
  }
  
  if (fileExists) {
    if ((await fs.stat(destination)).isDirectory()) {
      if (!(await fs.readdir(destination)).empty) throw "Given destination is not empty."
    }
    else throw "Given destination is not a directory."
  }
  else await fs.mkdir(destination)
  

  let ls = await fs.readdir(resDir)
  if (ls.includes(which)) {
    let from = path.join(resDir, which)
    await copy(from, destination)
  }
  else throw "Trying to copy invalid template: \"" + which + "\". Cannot be found within " + ls.toString()
}