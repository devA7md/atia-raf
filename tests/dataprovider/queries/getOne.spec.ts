import { getOne } from "../../../src/dataProvider/queries";
import { initTest } from "../../utils";
import { getLogger } from "../../../src/utils";

let config: any;
const resource = "SOME_COLLECTION_NAME";
const fakeDocumentId = "FAKE_ID";
const fakeDocument = {
  name: "ANY_DOCUMENT_NAME",
};

function getOneDocumentById(id: string) {
  return getOne(
    {
      db: config.db,
      storage: config.storage,
      logger: getLogger(),
      options: {},
    },
    {},
    resource,
    { id }
  );
}

describe("Test getOne api", () => {
  beforeAll(async () => {
    config = await initTest();
  });

  beforeEach(async () => {
    await config.db.collection(resource).doc(fakeDocumentId).set(fakeDocument);
  });

  afterEach(() => {
    config.clearFirestore();
  });

  it("should get a document if queried with valid criteria", async () => {
    const result = await getOneDocumentById(fakeDocumentId);
    expect(result.data).toEqual({ id: fakeDocumentId, name: fakeDocument.name });
  });

  it("should return empty object if document is not exists", async () => {
    const result = await getOneDocumentById("ID_NOT_EXISTS");
    expect(result.data).toEqual({});
  });
});
