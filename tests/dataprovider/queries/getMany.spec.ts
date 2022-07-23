import { GetManyParams } from "react-admin";

import { getMany } from "../../../src/dataProvider/queries";
import { generateFakeDocuments, initTest } from "../../utils";
import { getLogger } from "../../../src/utils";

let config: any;
const resource = "SOME_COLLECTION_NAME";
const totalGeneratedFakeDocuments = 20;
let fakeDocuments: any[] = [];

function getDocuments(userParams?: Partial<GetManyParams>) {
  const params: GetManyParams = {
    ids: userParams?.ids ?? fakeDocuments.map((doc) => doc.id),
  };

  return getMany(
    {
      db: config.db,
      storage: config.storage,
      logger: getLogger(),
      options: {},
    },
    {},
    resource,
    params
  );
}

describe("Test getMany api", () => {
  beforeAll(async () => {
    config = await initTest();
  });

  beforeEach(async () => {
    fakeDocuments = generateFakeDocuments(totalGeneratedFakeDocuments);
    for (const doc of fakeDocuments) {
      await config.db.collection(resource).doc(doc.id).set(doc);
    }
  });

  afterEach(() => {
    config.clearFirestore();
  });

  it("should return list of documents related to passed array of ids", async () => {
    const result = await getDocuments();

    expect(result.data.length).toBe(totalGeneratedFakeDocuments);
  });
});
