import { log, info, setVerbose, setTestEnv } from "../app/lib/logger/logger"
import main, { wrapErrors } from "../app/index"
import { promises as fs } from "fs"
import delay from "delay"
const destination = "./test_out";

wrapErrors(true);


(async () => {
  setVerbose(true)
  setTestEnv(true)
  // try {
  await fs.rmdir(destination, { recursive: true })
  // }
  

  await main("module", {destination, name: "testName"})

  

})()