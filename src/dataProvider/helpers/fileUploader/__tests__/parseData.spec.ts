import { prepareDataUploads } from "../prepareData";
import { testData } from "./data";

describe("test function", () => {
  it("can loop throw data", () => {
    prepareDataUploads(testData);

    expect(true).toBeTruthy();
  });
});
