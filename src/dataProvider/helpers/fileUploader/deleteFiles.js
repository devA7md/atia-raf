"use strict";
exports.__esModule = true;
exports.deleteFiles = void 0;
var storage_1 = require("firebase/storage");
var deleteFiles = function (_a) {
    var logger = _a.logger, fileRefs = _a.fileRefs;
    var deletedFiles = Object.values(fileRefs).map(function (ref) { return (0, storage_1.deleteObject)(ref); });
    return Promise.all(deletedFiles)
        .then(function () {
        logger("Unwanted files have been deleted");
    })["catch"](function (ex) {
        logger(ex.message);
    });
};
exports.deleteFiles = deleteFiles;
