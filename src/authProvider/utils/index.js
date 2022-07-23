"use strict";
exports.__esModule = true;
exports.checkAuthedUser = void 0;
var auth_1 = require("firebase/auth");
var checkAuthedUser = function (_a) {
    var auth = _a.auth, logger = _a.logger;
    return new Promise(function (resolve, reject) {
        var unsubscribeToAuthChange = (0, auth_1.onAuthStateChanged)(auth, {
            next: function (currentUser) {
                unsubscribeToAuthChange();
                if (currentUser)
                    resolve(currentUser);
                else
                    reject("User not found");
            },
            error: function (ex) {
                logger(ex.message);
                unsubscribeToAuthChange();
                reject(ex.message);
            },
            complete: function () {
                // do nothing!
            }
        });
    });
};
exports.checkAuthedUser = checkAuthedUser;
