"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("xrray")(Array);
const logger_1 = require("./lib/logger/logger");
const leven_1 = require("leven");
const module_1 = require("./project/module/module");
let project = {
    module: module_1.default,
};
let alias = {
    module: "module",
    mod: "module",
    m: "module",
    mad: "module"
};
async function default_1(projectKind = "module", options) {
    let p = alias[projectKind];
    if (p === undefined) {
        logger_1.error("Unknown project \"" + projectKind + "\". Did you mean: ... ?");
        let close = [];
        let barrier = 3;
        let aliases = Object.keys(alias);
        aliases.ea((e) => {
            if (leven_1.default(e, projectKind) <= barrier)
                close.add(e);
        });
        let s = "";
        close.ea((e, i) => {
            if ((i + 1) % 3 === 0)
                s += e + "\n\t ";
            else
                s += e + "\t\t";
        });
        logger_1.error("");
        logger_1.error(s);
        return;
    }
    logger_1.info("Starting project \"" + p + "\" with the following options: ", options);
    try {
        await project[p](options);
    }
    catch (e) {
        logger_1.error(e.message || "Unknown");
    }
}
exports.default = default_1;
