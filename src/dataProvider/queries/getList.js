"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
exports.getList = void 0;
var firestore_1 = require("firebase/firestore");
var ramda_1 = require("ramda");
var utils_1 = require("../../utils");
exports.getList = (0, ramda_1.curry)(function (_a, customDataProvider, resource, params) {
    var db = _a.db, logger = _a.logger;
    return __awaiter(void 0, void 0, void 0, function () {
        var defaultQuery;
        var _b;
        return __generator(this, function (_c) {
            logger(resource, params);
            if ((_b = customDataProvider[resource]) === null || _b === void 0 ? void 0 : _b.getList) {
                defaultQuery = customDataProvider[resource].getList;
            }
            else {
                defaultQuery = function (resource, params) { return __awaiter(void 0, void 0, void 0, function () {
                    var data, _a, field, order, perPage, filter, queryConstraint, snapshots, ex_1;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                data = [];
                                _b.label = 1;
                            case 1:
                                _b.trys.push([1, 3, , 4]);
                                _a = params.sort, field = _a.field, order = _a.order, perPage = params.pagination.perPage, filter = params.filter;
                                queryConstraint = [(0, firestore_1.limit)(perPage)];
                                if (field !== "id") {
                                    queryConstraint.push((0, firestore_1.orderBy)(field, order.toLowerCase()));
                                }
                                if (Object.keys(filter).length) {
                                    queryConstraint.push.apply(queryConstraint, Object.entries(filter).map(function (_a) {
                                        var fieldPath = _a[0], value = _a[1];
                                        return (0, firestore_1.where)(fieldPath, "==", value);
                                    }));
                                }
                                return [4 /*yield*/, (0, firestore_1.getDocs)(firestore_1.query.apply(void 0, __spreadArray([(0, firestore_1.collection)(db, resource)], queryConstraint, false)))];
                            case 2:
                                snapshots = _b.sent();
                                data = snapshots.docs.map(utils_1.addIdToDocument);
                                return [3 /*break*/, 4];
                            case 3:
                                ex_1 = _b.sent();
                                logger(ex_1.message);
                                throw new Error(ex_1);
                            case 4: return [2 /*return*/, {
                                    data: data,
                                    total: undefined
                                }];
                        }
                    });
                }); };
            }
            return [2 /*return*/, defaultQuery(resource, params)];
        });
    });
});
