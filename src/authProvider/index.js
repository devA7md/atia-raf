"use strict";
exports.__esModule = true;
var ramda_1 = require("ramda");
var queries_1 = require("./queries");
var authProvider = (0, ramda_1.curry)(function (authProviderModules, customAuthProvider) {
    return {
        login: (0, queries_1.login)(authProviderModules, customAuthProvider),
        logout: (0, queries_1.logout)(authProviderModules, customAuthProvider),
        checkAuth: (0, queries_1.checkAuth)(authProviderModules, customAuthProvider),
        checkError: (0, queries_1.checkError)(authProviderModules, customAuthProvider),
        getIdentity: (0, queries_1.getIdentity)(authProviderModules, customAuthProvider),
        getPermissions: (0, queries_1.getPermissions)(authProviderModules, customAuthProvider)
    };
});
exports["default"] = authProvider;
