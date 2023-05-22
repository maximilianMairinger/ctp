import chalk from "chalk"

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
  go(0, "Warn", "warn", "yellow", msg)
}

export function error(...msg: any[]) {
  go(1, "Error", "error", "red", msg)
}

function range(l: number) {
  let a: number[] = []
  for (let i = 0; i < l; i++) {
    a.push(i)
  }
  return a
}

const indentCount = 7
function indent(str: string) {
  for (const i of range(indentCount - str.length)) {
    str += " "
  }
  return str
}

function go(severity: 0 | 1, prefix: string, kind: string, color: string, msg: any[]) {
  let n = []
  let err = []
  msg.forEach((m) => {
    if (m instanceof Error) {
      err.push(m.stack)
      n.push(m.message)
    }
    else n.push(m)
  })

  let strings = []
  let notStrings = []
  msg.forEach((s) => {
    if (typeof s === "string") strings.push(s.split("\n").join("\n" + indent("") + " "))
    else notStrings.push(s)
  })


  if (severity === 1 || verbose) console[kind](chalk[color]((last !== kind ? indent(prefix) : (indent("") + " ")), ...strings), ...notStrings)
  if (testEnv && err.length !== 0) console.log(...err)
  

  let lmsg = msg[msg.length-1]
  if (typeof lmsg === "string" && lmsg.substr(lmsg.length-1) === "\n") last = ""
  else last = kind
}