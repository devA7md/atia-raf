import { CreateParams } from "react-admin";

import { create } from "../../../src/dataProvider/queries";
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

function createDocument(userParams?: Partial<CreateParams>) {
  const params: CreateParams = {
    data: userParams?.data ?? {},
  };

  return create(
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

describe("Test create api", () => {
  beforeAll(async () => {
    config = await initTest();
  });

  afterEach(() => {
    config.clearFirestore();
  });

  it("should create a document and return its automatic generated id", async () => {
    const result = await createDocument({ data: fakeDocument });

    expect(result.data).toBeTruthy();
    expect(result.data.id).toBeTruthy();
  });

  it("should throw when trying to create a doc with invalid data", async () => {
    try {
      await createDocument({
        data: {
          name: undefined,
        },
      });
    } catch (ex: any) {
      expect(ex).toBeInstanceOf(Error);
    }
  });
});
