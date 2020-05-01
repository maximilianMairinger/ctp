import { setVerbose, setTestEnv } from "../app/lib/logger/logger"
import main, { wrapErrors } from "../app/index"
import del from "del"
import { index as configIndex } from "./configIndex"
import * as yargs from "yargs"
import * as path from "path"
import { promises as fs } from "fs"
const args = yargs.argv
const destination = "./test_out"





if (!process.env.CI) wrapErrors(true);

setVerbose(true)
setTestEnv(true)

const modsToBeRun: string[] = args._.length === 0 ? Object.keys(configIndex) : args._

del(destination)
.then(() => fs.mkdir(destination))
.then(() => {
  for (let i = 0; i < modsToBeRun.length; i++) {
    const modName = modsToBeRun[i];
    let config = configIndex[modName]
    config.destination = path.join(destination, modName)
    
    try {
      main(modName, configIndex[modName])
    }
    catch(e) {
      throw e
    }
  }
})


