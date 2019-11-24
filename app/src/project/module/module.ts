import { info, log, warn } from "./../../lib/logger/logger"


export default function(arg: any) {
  info("test", 2)
  throw "desc"
}