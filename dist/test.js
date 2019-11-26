"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("./lib/logger/logger");
const index_1 = require("./index");
logger_1.setVerbose(true);
(async () => {
    await index_1.default("mod", { destination: "./test_out", });
    logger_1.info("DONE");
})();
