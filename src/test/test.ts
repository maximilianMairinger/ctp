import { setVerbose, setTestEnv } from "../app/lib/logger/logger"
import main, { wrapErrors } from "../app/index"
import * as del from "del"
const destination = "./test_out";
import * as path from "path"


if (!process.env.CI) wrapErrors(true);


try {
  (async () => {
    setVerbose(true)
    setTestEnv(true)
    await del(destination)
    
  
    await main("module", {
      destination, 
      name: "testName", 
      description: "desc", 
      keywords: ["keyword1", "keyword2"],
      dependencies: ["xrray", "animation-frame-delta"],
      author: "Maximilian Mairinger", 
      githubUsername: "maximilianMairinger",
    })
  
    
  
  })()
}
catch(e) {
  console.log()
  throw e
}
