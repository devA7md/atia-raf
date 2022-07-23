"use strict";
exports.__esModule = true;
var ramda_1 = require("ramda");
var queries_1 = require("./queries");
var dataProvider = (0, ramda_1.curry)(function (firebaseModules, customDataProvider) {
    return {
        getList: (0, queries_1.getList)(firebaseModules, customDataProvider),
        getOne: (0, queries_1.getOne)(firebaseModules, customDataProvider),
        getMany: (0, queries_1.getMany)(firebaseModules, customDataProvider),
        getManyReference: (0, queries_1.getManyReference)(firebaseModules, customDataProvider),
        create: (0, queries_1.create)(firebaseModules, customDataProvider),
        update: (0, queries_1.update)(firebaseModules, customDataProvider),
        updateMany: (0, queries_1.updateMany)(firebaseModules, customDataProvider),
        "delete": (0, queries_1.deleteQuery)(firebaseModules, customDataProvider),
        deleteMany: (0, queries_1.deleteMany)(firebaseModules, customDataProvider)
    };
});
exports["default"] = dataProvider;
