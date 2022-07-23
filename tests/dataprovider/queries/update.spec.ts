import { UpdateParams } from "react-admin";

import { update } from "../../../src/dataProvider/queries";
import { getLogger } from "../../../src/utils";
import { initTest } from "../../utils";

let config: any;
const resource = "SOME_COLLECTION_NAME";

const fakeDocument = {
  id: "FAKE_ID",
  name: "FAKE_NAME",
  nested: {
    title: "SUB_FAKE_NAME",
  },
};

const updatedFakeDocument = {
  name: "NEW_UPDATED_NAME",
};

function updateDocument(userParams?: Partial<UpdateParams>) {
  const params: UpdateParams = {
    id: userParams?.id ?? "",
    data: userParams?.data ?? {},
    previousData: userParams?.previousData ?? {},
  };

  return update(
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

describe("Test update api", () => {
  beforeAll(async () => {
    config = await initTest();
  });

  beforeEach(async () => {
    await config.db.collection(resource).doc(fakeDocument.id).set(fakeDocument);
  });

  afterEach(() => {
    config.clearFirestore();
  });

  it("should update a document and return its automatic generated id", async () => {
    await updateDocument({ id: fakeDocument.id, previousData: fakeDocument, data: updatedFakeDocument });
    const updatedDocument = await config.db.collection(resource).doc(fakeDocument.id).get();

    expect(updatedDocument.data().name).toBe(updatedFakeDocument.name);
  });

  it("should throw when trying to update a doc with invalid data", async () => {
    try {
      await updateDocument({
        id: fakeDocument.id,
        previousData: fakeDocument,
        data: {
          name: undefined,
        },
      });
    } catch (ex: any) {
      expect(ex).toBeInstanceOf(Error);
    }
  });
});
