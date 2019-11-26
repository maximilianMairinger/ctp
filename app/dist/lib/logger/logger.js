let verbose = false;
let last = "";
export function setVerbose(to) {
    verbose = to;
}
export function info(...msg) {
    go(0, "Info", "info", msg);
}
export function log(...msg) {
    go(1, "Log", "log", msg);
}
export function warn(...msg) {
    go(0, "Warn", "warn", msg);
}
export function error(...msg) {
    go(1, "Error", "error", msg);
}
function go(severity, prefix, kind, msg) {
    if (severity === 1 || verbose)
        console[kind]((last !== kind ? prefix + ":\t" : "\t"), ...msg);
    last = kind;
}
