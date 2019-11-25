"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const copyTemplate_1 = require("../../lib/copyTemplate/copyTemplate");
async function default_1(options) {
    await copyTemplate_1.default("module", options.destination);
}
exports.default = default_1;
