import { log, info, setVerbose } from "../app/lib/logger/logger"
import main from "../app/index"

setVerbose(true);

main("module", {destination: "./test_out", name: "testName"})
