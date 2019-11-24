import {argv as args} from 'yargs'
let verbose = args.verbose || args.v
let last = ""


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