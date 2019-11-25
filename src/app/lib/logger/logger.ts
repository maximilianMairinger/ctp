let verbose = false
let last = ""

export function setVerbose(to: boolean) {
  verbose = to
}




export function info(...msg: any[]) {
  go(0, "Info", "info", msg)
}

export function log(...msg: any[]) {
  go(1, "Log", "log", msg)
}

export function warn(...msg: any[]) {
  go(0, "Warn", "warn", msg)
}

export function error(...msg: any[]) {
  go(1, "Error", "error", msg)
}

function go(severity: 0 | 1, prefix: string, kind: string, msg: any[]) {
  if (severity === 1 || verbose) console[kind]((last !== kind ? prefix + ":\t" : "\t"), ...msg)
  last = kind
}