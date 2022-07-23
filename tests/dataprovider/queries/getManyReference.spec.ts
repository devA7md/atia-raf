import { GetManyReferenceParams } from "react-admin";

import { getManyReference } from "../../../src/dataProvider/queries";
import { customDocument, generateFakeDocuments, initTest } from "../../utils";
import { getLogger } from "../../../src/utils";

let config: any;
const resource = "SOME_COLLECTION_NAME";

const totalGeneratedFakeDocuments = 10;
const defaultPerPageDocuments = 5;

const additionalDocumentFields = {
  ref_id: "REF_ID",
};
let fakeDocuments: any[] = [];

function getDocuments(userParams?: Partial<GetManyReferenceParams>) {
  const params: GetManyReferenceParams = {
    id: userParams?.id ?? "REF_ID",
    target: userParams?.target ?? "ref_id",
    filter: userParams?.filter ?? {},
    sort: userParams?.sort ?? { field: "name", order: "ASC" },
    pagination: userParams?.pagination ?? { page: 1, perPage: defaultPerPageDocuments },
  };

  return getManyReference(
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

describe("Test getManyReference api", () => {
  beforeAll(async () => {
    config = await initTest();
  });

  beforeEach(async () => {
    fakeDocuments = generateFakeDocuments(totalGeneratedFakeDocuments, additionalDocumentFields);
    for (const doc of fakeDocuments) {
      await config.db.collection(resource).doc(doc.id).set(doc);
    }
  });

  afterEach(() => {
    config.clearFirestore();
  });

  it("should return list of documents for a specific reference field", async () => {
    const result = await getDocuments();
    expect(result.data.length).toBe(defaultPerPageDocuments);
  });

  it("should return a list of documents for custom filter", async () => {
    const result = await getDocuments({ filter: { name: customDocument.name } });
    expect(result.data.length).toBe(1);
    expect(result.data[0].name).toBe(customDocument.name);
  });

  it("should return sorted list of documents (ascending)", async () => {
    const sortedDocuments = fakeDocuments.sort((a, b) => (a.name > b.name ? 1 : -1)).slice(0, 1);

    const result = await getDocuments({
      sort: { field: "name", order: "ASC" },
      pagination: { page: 1, perPage: 1 },
    });

    expect(Object.values(result.data)).toEqual(sortedDocuments);
  });

  it("should return sorted list of documents (descending)", async () => {
    const sortedDocuments = fakeDocuments.sort((a, b) => (a.name < b.name ? 1 : -1)).slice(0, 1);

    const result = await getDocuments({
      sort: { field: "name", order: "DESC" },
      pagination: { page: 1, perPage: 1 },
    });

    expect(Object.values(result.data)).toEqual(sortedDocuments);
  });
});
