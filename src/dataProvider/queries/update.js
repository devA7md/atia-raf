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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
exports.__esModule = true;
exports.update = void 0;
var firestore_1 = require("firebase/firestore");
var ramda_1 = require("ramda");
var fileUploader_1 = require("../helpers/fileUploader");
var utils_1 = require("../../utils");
exports.update = (0, ramda_1.curry)(function (_a, customDataProvider, resource, params) {
    var db = _a.db, storage = _a.storage, logger = _a.logger;
    return __awaiter(void 0, void 0, void 0, function () {
        var defaultQuery;
        var _b;
        return __generator(this, function (_c) {
            logger(resource, params);
            if ((_b = customDataProvider[resource]) === null || _b === void 0 ? void 0 : _b.update) {
                defaultQuery = customDataProvider[resource].update;
            }
            else {
                defaultQuery = function (resource, params) { return __awaiter(void 0, void 0, void 0, function () {
                    var uploadedRefs, uploads, _a, dataWithUploadedFiles, rest, ex_1;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                uploadedRefs = {};
                                _b.label = 1;
                            case 1:
                                _b.trys.push([1, 5, , 7]);
                                uploads = (0, fileUploader_1.prepareDataUploads)(params.data);
                                return [4 /*yield*/, (0, fileUploader_1.fileUploader)({
                                        logger: logger,
                                        storage: storage,
                                        fileUploaderData: {
                                            resource: resource,
                                            uploads: uploads,
                                            originalData: (0, ramda_1.omit)(["id"])(params.data)
                                        }
                                    })];
                            case 2:
                                _a = _b.sent(), dataWithUploadedFiles = _a.dataWithUploadedFiles, rest = __rest(_a, ["dataWithUploadedFiles"]);
                                uploadedRefs = rest.uploadedRefs;
                                if (!dataWithUploadedFiles) return [3 /*break*/, 4];
                                return [4 /*yield*/, (0, firestore_1.updateDoc)((0, firestore_1.doc)(db, resource, params.id), (0, utils_1.applyUpdateTimestamp)(dataWithUploadedFiles))];
                            case 3:
                                _b.sent();
                                // delete old files if user replaced its value with new one
                                (0, fileUploader_1.deleteFiles)({
                                    logger: logger,
                                    fileRefs: (0, fileUploader_1.getPreviousFileRefs)({ uploadedRefs: uploadedRefs, previousData: params.previousData, storage: storage })
                                });
                                _b.label = 4;
                            case 4: return [3 /*break*/, 7];
                            case 5:
                                ex_1 = _b.sent();
                                logger(ex_1.message);
                                return [4 /*yield*/, (0, fileUploader_1.deleteFiles)({ fileRefs: uploadedRefs, logger: logger })];
                            case 6:
                                _b.sent();
                                throw new Error(ex_1);
                            case 7: return [2 /*return*/, {
                                    data: { id: params.id }
                                }];
                        }
                    });
                }); };
            }
            return [2 /*return*/, defaultQuery(resource, params)];
        });
    });
});
