"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs = require("fs");
const copydir = require("copy-dir");
let resDir = path.join(__dirname, "../../../res/templates");
function default_1(which, to) {
    return new Promise((res, rej) => {
        fs.readdir(resDir, (err, ls) => {
            if (err)
                return rej(err);
            if (ls.includes(which)) {
                let from = path.join(resDir, which);
                copydir(from, to, {}, (err) => {
                    if (err)
                        return rej(err);
                    res();
                });
            }
            else
                rej("Trying to copy invalid template: \"" + which + "\". Cannot be found in " + ls.toString());
        });
    });
}
exports.default = default_1;
