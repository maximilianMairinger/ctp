import { setVerbose, setTestEnv } from "../app/lib/logger/logger"
import main, { wrapErrors } from "../app/index"
import { promises as fs } from "fs"
const destination = "./test_out";


if (!process.env.CI) wrapErrors(true);


try {
  (async () => {
    setVerbose(true)
    setTestEnv(true)
    await fs.rmdir(destination, { recursive: true })
    
  
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
  throw e
}
