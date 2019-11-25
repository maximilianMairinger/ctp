#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
const yargs_1 = require("yargs");
let projectKind = yargs_1.argv._.first || "module";
yargs_1.argv.destination = yargs_1.argv.destination || "./";
let options = { destination: yargs_1.argv.destination || "./", ...yargs_1.argv };
delete options._;
delete options["$0"];
//@ts-ignore
index_1.default(projectKind, options);
