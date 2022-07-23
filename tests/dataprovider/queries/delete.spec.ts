import { DeleteParams } from "react-admin";

import { initTest } from "../../utils";
import { deleteQuery } from "../../../src/dataProvider/queries";
import { getLogger } from "../../../src/utils";

let config: any;
const resource = "SOME_COLLECTION_NAME";

const fakeDocument = {
  id: "FAKE_ID",
  name: "FAKE_NAME",
  nested: {
    title: "SUB_FAKE_NAME",
  },
};

function deleteDocument(userParams?: Partial<DeleteParams>) {
  const params: DeleteParams = {
    id: userParams?.id ?? "",
  };

  return deleteQuery(
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

describe("Test delete api", () => {
  beforeAll(async () => {
    config = await initTest();
  });

  beforeEach(async () => {
    await config.db.collection(resource).doc(fakeDocument.id).set(fakeDocument);
  });

  afterEach(() => {
    config.clearFirestore();
  });

  it("should return empty snapshot if deleted successfully", async () => {
    await deleteDocument({ id: fakeDocument.id });
    const snapshot = await config.db.collection(resource).doc(fakeDocument.id).get();
    expect(snapshot.exists).toBeFalsy();
  });
});
