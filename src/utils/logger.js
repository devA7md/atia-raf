"use strict";
exports.__esModule = true;
exports.getLogger = void 0;
var getLogger = function (shouldLog) {
    if (shouldLog === void 0) { shouldLog = false; }
    if (shouldLog) {
        return console.log.bind(console, "🎈 raf:");
    }
    return function () { return undefined; };
};
exports.getLogger = getLogger;
