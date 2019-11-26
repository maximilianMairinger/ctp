import * as chalk from "chalk"

let verbose = false
let last = ""

export function setVerbose(to: boolean) {
  verbose = to
}


export function info(...msg: any[]) {
  go(0, "Info", "info", "cyanBright", msg)
}

export function log(...msg: any[]) {
  go(1, "Log", "log", "blue", msg)
}

export function warn(...msg: any[]) {
  go(0, "Warn", "warn", "yellow", msg)
}

export function error(...msg: any[]) {
  go(1, "Error", "error", "red", msg)
}

function go(severity: 0 | 1, prefix: string, kind: string, color: string, msg: any[]) {
  if (severity === 1 || verbose) console[kind](chalk[color]((last !== kind ? prefix + ":\t" : "\t"), ...msg))
  

  let lmsg = msg.last
  if (typeof lmsg === "string" && lmsg.substr(lmsg.length-1) === "\n") last = ""
  else last = kind
}