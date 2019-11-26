#!/usr/bin/env node
import main from "../index";
import { argv as args } from 'yargs';
import { setVerbose } from "../lib/logger/logger";
import alias from "./../projectAlias";
import moduleInq from "./inquery/module/module";
import inq from "./inq";
//@ts-ignore
setVerbose(args.v || args.verbose);
let projectKind = args._.first || "module";
args.destination = args.destination || "./";
let options = { destination: args.destination || "./", ...args };
delete options._;
delete options["$0"];
delete options.v;
delete options.verbose;
let inqIndex = {
    module: moduleInq
};
projectKind = alias[projectKind];
(async () => {
    options = await inq(inqIndex[projectKind], options);
    console.log("log", options);
    await main(projectKind, options);
})();
