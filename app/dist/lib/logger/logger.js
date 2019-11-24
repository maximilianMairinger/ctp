"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const yargs_1 = require("yargs");
let verbose = yargs_1.argv.verbose || yargs_1.argv.v;
function info(...msg) {
    go(0, "Info", "info", msg);
}
exports.info = info;
function log(...msg) {
    go(1, "Log", "log", msg);
}
exports.log = log;
function warn(...msg) {
    go(0, "Warn", "warn", msg);
}
exports.warn = warn;
function error(...msg) {
    go(1, "Error", "error", msg);
}
exports.error = error;
function go(severity, prefix, kind, msg) {
    if (severity === 1 || verbose)
        console[kind](prefix + ":", ...msg);
}
