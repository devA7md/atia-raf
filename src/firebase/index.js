"use strict";
exports.__esModule = true;
exports.configureApp = void 0;
var app_1 = require("firebase/app");
var auth_1 = require("firebase/auth");
var firestore_1 = require("firebase/firestore");
var storage_1 = require("firebase/storage");
var authProvider_1 = require("../authProvider");
var dataProvider_1 = require("../dataProvider");
var options_1 = require("../options");
var utils_1 = require("../utils");
var configureApp = function (firebaseOptions, userOptions) {
    var app = (0, app_1.initializeApp)(firebaseOptions);
    var auth = (0, auth_1.getAuth)(app);
    var db = (0, firestore_1.getFirestore)(app);
    var storage = (0, storage_1.getStorage)(app);
    var options = userOptions !== null && userOptions !== void 0 ? userOptions : options_1.defaultOptions;
    var logger = (0, utils_1.getLogger)(options.log);
    var getAuthProvider = (0, authProvider_1["default"])({ auth: auth, options: options, logger: logger });
    var getDataProvider = (0, dataProvider_1["default"])({
        db: db,
        storage: storage,
        options: options,
        logger: logger
    });
    return {
        app: app,
        auth: auth,
        db: db,
        storage: storage,
        getAuthProvider: getAuthProvider,
        getDataProvider: getDataProvider
    };
};
exports.configureApp = configureApp;
