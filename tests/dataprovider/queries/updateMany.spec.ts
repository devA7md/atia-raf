import { UpdateManyParams } from "react-admin";

import { updateMany } from "../../../src/dataProvider/queries";
import { getLogger } from "../../../src/utils";
import { generateFakeDocuments, initTest } from "../../utils";
import { DocumentSnapshot } from "firebase/firestore";

let config: any;
const resource = "SOME_COLLECTION_NAME";

const fakeDocuments = generateFakeDocuments(10);

const updatedFakeDocument = {
  name: "NEW_UPDATED_NAME",
};

function updateManyDocument(userParams?: Partial<UpdateManyParams>) {
  const params: UpdateManyParams = {
    ids: userParams?.ids ?? [],
    data: userParams?.data ?? {},
  };

  return updateMany(
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
    for (const doc of fakeDocuments) {
      await config.db.collection(resource).doc(doc.id).set(doc);
    }
  });

  afterEach(() => {
    config.clearFirestore();
  });

  it("should update documents", async () => {
    await updateManyDocument({ ids: fakeDocuments.map((doc) => doc.id), data: updatedFakeDocument });
    const snapshots = await config.db.collection(resource).get();
    const updatedDocuments = snapshots.docs.map((snapshot: DocumentSnapshot) => snapshot?.data?.()?.name);

    const flattenedDocuments = Array.from(new Set(updatedDocuments));
    expect(flattenedDocuments.length).toBe(1);
    expect(flattenedDocuments[0]).toEqual(updatedFakeDocument.name);
  });

  it("should throw when trying to update any doc with invalid data", async () => {
    try {
      await updateManyDocument({
        ids: fakeDocuments.map((doc) => doc.id),
        data: {
          name: undefined,
        },
      });
    } catch (ex: any) {
      expect(ex).toBeInstanceOf(Error);
    }
  });
});
