import { log, info, setVerbose } from "../lib/logger/logger"
import main from "../index"

setVerbose(true);

main("module", {destination: "./test_out"})
