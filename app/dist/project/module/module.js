"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("./../../lib/logger/logger");
function default_1(arg) {
    logger_1.info("test", 2);
    throw "desc";
}
exports.default = default_1;
