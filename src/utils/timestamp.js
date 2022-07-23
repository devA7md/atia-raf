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
exports.applyUpdateTimestamp = exports.applyCreateTimestamp = void 0;
var firestore_1 = require("firebase/firestore");
var ramda_1 = require("ramda");
var ApplyTimestampType;
(function (ApplyTimestampType) {
    ApplyTimestampType["update"] = "update";
    ApplyTimestampType["create"] = "create";
})(ApplyTimestampType || (ApplyTimestampType = {}));
// todo - pass timestamp keys instead of hard coded ones `updatedAt` & `createdAt`
var applyTimestamps = (0, ramda_1.curry)(function (type, data) {
    if (type === ApplyTimestampType.update) {
        return __assign(__assign({}, data), { updatedAt: (0, firestore_1.serverTimestamp)() });
    }
    else {
        return __assign(__assign({}, data), { createdAt: (0, firestore_1.serverTimestamp)(), updatedAt: (0, firestore_1.serverTimestamp)() });
    }
});
exports.applyCreateTimestamp = applyTimestamps(ApplyTimestampType.create);
exports.applyUpdateTimestamp = applyTimestamps(ApplyTimestampType.update);
