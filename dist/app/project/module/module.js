"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
function default_1(options) {
    fs.readdir("./", (err, ls) => {
        console.log(ls);
    });
    fs.stat("./", (err, stat) => {
        if (err)
            throw err;
        console.log(stat.isDirectory());
    });
}
exports.default = default_1;
