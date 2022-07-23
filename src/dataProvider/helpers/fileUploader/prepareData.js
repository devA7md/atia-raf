"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
exports.getPreviousFileRefs = exports.parseDataRecursively = exports.prepareDataUploads = void 0;
var storage_1 = require("firebase/storage");
var ramda_1 = require("ramda");
var prepareDataUploads = function (data) {
    var uploads = [];
    for (var _i = 0, _a = Object.entries(data); _i < _a.length; _i++) {
        var _b = _a[_i], key = _b[0], value = _b[1];
        (0, exports.parseDataRecursively)(key, value, uploads);
    }
    return uploads;
};
exports.prepareDataUploads = prepareDataUploads;
var parseDataRecursively = function (fieldPath, value, uploads) {
    // check primitive value
    if (!value || typeof value !== "object")
        return value;
    // check timestamp value
    if (value.toDate && typeof value.toDate === "function")
        return value.toDate();
    // check input file value
    if (typeof value === "object" && Object.prototype.hasOwnProperty.call(value, "rawFile")) {
        uploads.push({
            fieldPath: fieldPath,
            fileData: value
        });
        return;
    }
    // parse data again if the value is an array
    if (Array.isArray(value)) {
        value.forEach(function (entry, index) { return (0, exports.parseDataRecursively)("".concat(fieldPath, ".").concat(index), entry, uploads); });
        return;
    }
    // case of the value is a normal object
    Object.entries(value).forEach(function (_a) {
        var nestedFieldPath = _a[0], nestedValue = _a[1];
        return (0, exports.parseDataRecursively)("".concat(fieldPath, ".").concat(nestedFieldPath), nestedValue, uploads);
    });
};
exports.parseDataRecursively = parseDataRecursively;
var getPreviousFileRefs = function (_a) {
    var uploadedRefs = _a.uploadedRefs, storage = _a.storage, previousData = _a.previousData;
    return Object.keys(uploadedRefs).reduce(function (acc, key) {
        var _a;
        return __assign(__assign({}, acc), (_a = {}, _a[key] = (0, storage_1.ref)(storage, (0, ramda_1.path)(key.split("."), previousData).path), _a));
    }, {});
};
exports.getPreviousFileRefs = getPreviousFileRefs;
