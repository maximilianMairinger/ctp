import * as path from "path"
import { promises as fs } from "fs"
import { log } from "../logger/logger"
import fileExists from "../fileExists/fileExists"
import * as copy from "recursive-copy"

let resDir = path.join(__dirname, "../../../../res/templates")


export default async function(which: string, destination: string) {
  if (await fileExists(destination)) {
    if ((await fs.stat(destination)).isDirectory()) {
      if (!(await fs.readdir(destination)).empty) throw "Given destination is not empty."
    }
    else throw "Given destination is not a directory."
  }
  else await fs.mkdir(destination)
  

  let ls = await fs.readdir(resDir)
  if (ls.includes(which)) {
    let from = path.join(resDir, which)
    await copy(from, destination, {dot: true})
  }
  else throw "Trying to copy invalid template: \"" + which + "\". Cannot be found within " + ls.toString()
}