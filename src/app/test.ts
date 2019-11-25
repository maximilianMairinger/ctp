import { log, info, setVerbose } from "./lib/logger/logger"
import main from "./index"

setVerbose(true);

(async () => {
  await main("mod", {destination: "./test_out", })

  info("DONE")
})()
