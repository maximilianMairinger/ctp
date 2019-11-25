import { log, info, setVerbose } from "../lib/logger/logger"
import main from "../index"

setVerbose(true);

mod({destination: "./test_out"})
