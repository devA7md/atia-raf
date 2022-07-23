"use strict";
exports.__esModule = true;
var prepareData_1 = require("../prepareData");
var data_1 = require("./data");
describe("test function", function () {
    it("can loop throw data", function () {
        (0, prepareData_1.prepareDataUploads)(data_1.testData);
        expect(true).toBeTruthy();
    });
});
