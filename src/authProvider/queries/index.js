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
exports.getPermissions = exports.getIdentity = exports.checkError = exports.checkAuth = exports.logout = exports.login = void 0;
var login_1 = require("./login");
__createBinding(exports, login_1, "login");
var logout_1 = require("./logout");
__createBinding(exports, logout_1, "logout");
var checkAuth_1 = require("./checkAuth");
__createBinding(exports, checkAuth_1, "checkAuth");
var checkError_1 = require("./checkError");
__createBinding(exports, checkError_1, "checkError");
var getIdentity_1 = require("./getIdentity");
__createBinding(exports, getIdentity_1, "getIdentity");
var getPermissions_1 = require("./getPermissions");
__createBinding(exports, getPermissions_1, "getPermissions");
