import * as chalk from "chalk"

let verbose = false
let testEnv = false
let last = ""

export function setVerbose(to: boolean) {
  verbose = to
}

export function setTestEnv(to: boolean) {
  testEnv = to
}


export function info(...msg: any[]) {
  go(0, "Info", "info", "cyanBright", msg)
}

export function log(...msg: any[]) {
  go(1, "Log", "log", "blue", msg)
}

export function warn(...msg: any[]) {
  go(0, "Warning", "warn", "yellow", msg)
}

export function error(...msg: any[]) {
  let n = []
  let err = []
  msg.ea((m) => {
    if (m instanceof Error) {
      err.add(m.stack)
      n.add(m.message)
    }
    else n.add(m)
  })
  go(1, "Error", "error", "red", n)
  if (testEnv) go(1, "Error", "error", "red", err)
}

function go(severity: 0 | 1, prefix: string, kind: string, color: string, msg: any[]) {
  let strings = []
  let notStrings = []
  msg.ea((s) => {
    if (typeof s === "string") strings.add(s)
    else notStrings.add(s)
  })


  if (severity === 1 || verbose) console[kind](chalk[color]((last !== kind ? prefix + ":\t" : "\t"), ...strings), ...notStrings)
  

  let lmsg = msg.last
  if (typeof lmsg === "string" && lmsg.substr(lmsg.length-1) === "\n") last = ""
  else last = kind
}