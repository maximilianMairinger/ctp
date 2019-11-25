"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs = require("fs");
let resDir = path.join(__dirname, "../../../res/templates");
function default_1(what) {
    return new Promise((res, rej) => {
        fs.readdir(resDir, (err, ls) => {
            if (err)
                throw err;
            console.log("res", ls);
        });
    });
}
exports.default = default_1;
