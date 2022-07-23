import { DeleteManyParams } from "react-admin";

import { generateFakeDocuments, initTest } from "../../utils";
import { deleteMany } from "../../../src/dataProvider/queries";
import { getLogger } from "../../../src/utils";

let config: any;
const resource = "SOME_COLLECTION_NAME";

const fakeDocuments = generateFakeDocuments(10);

function deleteManyDocuments(userParams?: Partial<DeleteManyParams>) {
  const params: DeleteManyParams = {
    ids: userParams?.ids ?? [],
  };

  return deleteMany(
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

describe("Test deleteMany api", () => {
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

  it("should return empty snapshots if deleted successfully", async () => {
    await deleteManyDocuments({ ids: fakeDocuments.map((doc) => doc.id) });
    const snapshots = await config.db.collection(resource).get();
    expect(snapshots.empty).toBeTruthy();
  });
});
