import { GetListParams } from "react-admin";

import { getList } from "../../../src/dataProvider/queries";
import { generateFakeDocuments, initTest } from "../../utils";
import { getLogger } from "../../../src/utils";

let config: any;
const resource = "SOME_COLLECTION_NAME";
const totalGeneratedFakeDocuments = 10;
const defaultPerPageDocuments = 5;
let fakeDocuments: any[] = [];

function getDocuments(userParams?: Partial<GetListParams>) {
  const params: GetListParams = {
    filter: userParams?.filter ?? {},
    sort: userParams?.sort ?? { field: "name", order: "ASC" },
    pagination: userParams?.pagination ?? { page: 1, perPage: defaultPerPageDocuments },
  };

  return getList(
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

describe("Test getList api", () => {
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

  it("can list documents with default list params", async () => {
    const result = await getDocuments();
    expect(result.data.length).toBe(defaultPerPageDocuments);
  });

  it("can list documents based on custom filter", async () => {
    const result = await getDocuments({ filter: { name: "custom_name" } });
    expect(result.data.length).toBe(1);
    expect(result.data[0].name).toBe("custom_name");
  });

  it("can list documents sorted by name (ASC)", async () => {
    const sortedDocuments = fakeDocuments.sort((a, b) => (a.name > b.name ? 1 : -1)).slice(0, 1);

    const result = await getDocuments({
      sort: { field: "name", order: "ASC" },
      pagination: { page: 1, perPage: 1 },
    });

    expect(Object.values(result.data)).toEqual(sortedDocuments);
  });

  it("can list documents sorted by name (DESC)", async () => {
    const sortedDocuments = fakeDocuments.sort((a, b) => (a.name < b.name ? 1 : -1)).slice(0, 1);

    const result = await getDocuments({
      sort: { field: "name", order: "DESC" },
      pagination: { page: 1, perPage: 1 },
    });

    expect(Object.values(result.data)).toEqual(sortedDocuments);
  });
});
