"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs = require("fs");
let resDir = path.join(__dirname, "../../../res");
function default_1(what) {
    fs.readdir(resDir, (err, ls) => {
        if (err)
            throw err;
        console.log("res", ls);
    });
}
exports.default = default_1;
