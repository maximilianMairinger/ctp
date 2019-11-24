#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("xrray")(Array);
const yargs_1 = require("yargs");
const logger_1 = require("./lib/logger/logger");
const module_1 = require("./project/module/module");
let project = {
    module: module_1.default,
    mod: module_1.default,
    m: module_1.default,
};
let projectKind = yargs_1.argv._.first || "module";
try {
    //@ts-ignore
    project[projectKind](yargs_1.argv.destination || "./", yargs_1.argv);
}
catch (e) {
    logger_1.error(e);
}
