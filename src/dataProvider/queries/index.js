"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
exports.__esModule = true;
exports.updateMany = exports.update = exports.getOne = exports.getManyReference = exports.getMany = exports.getList = exports.deleteMany = exports.deleteQuery = exports.create = void 0;
var create_1 = require("./create");
__createBinding(exports, create_1, "create");
var delete_1 = require("./delete");
__createBinding(exports, delete_1, "deleteQuery");
var deleteMany_1 = require("./deleteMany");
__createBinding(exports, deleteMany_1, "deleteMany");
var getList_1 = require("./getList");
__createBinding(exports, getList_1, "getList");
var getMany_1 = require("./getMany");
__createBinding(exports, getMany_1, "getMany");
var getManyReference_1 = require("./getManyReference");
__createBinding(exports, getManyReference_1, "getManyReference");
var getOne_1 = require("./getOne");
__createBinding(exports, getOne_1, "getOne");
var update_1 = require("./update");
__createBinding(exports, update_1, "update");
var updateMany_1 = require("./updateMany");
__createBinding(exports, updateMany_1, "updateMany");
