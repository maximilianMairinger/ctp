"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("xrray")(Array);
const logger_1 = require("./lib/logger/logger");
const module_1 = require("./project/module/module");
let project = {
    module: module_1.default,
    mod: module_1.default,
    m: module_1.default,
};
function default_1(projectKind = "module", options) {
    try {
        project[projectKind](options);
    }
    catch (e) {
        logger_1.error(e);
    }
}
exports.default = default_1;
