import { DataProvider, DeleteManyParams, DeleteManyResult } from "react-admin";
import { doc, writeBatch } from "firebase/firestore";
import { curry } from "ramda";

import { CustomDataProvider, DataProviderModules } from "../../types";

type DeleteMany = DataProvider["deleteMany"];

export const deleteMany = curry<
  (
    dataProviderModules: DataProviderModules,
    customDataProvider: CustomDataProvider,
    resource: string,
    params: DeleteManyParams
  ) => ReturnType<DeleteMany>
>(async ({ db, logger }, customDataProvider, resource, params) => {
  logger(resource, params);

  let defaultQuery: DeleteMany;

  if (customDataProvider[resource]?.deleteMany) {
    defaultQuery = customDataProvider[resource].deleteMany!;
  } else {
    defaultQuery = async (resource, params): Promise<DeleteManyResult> => {
      const data: string[] = [];

      try {
        const batch = writeBatch(db);

        for (const id of params.ids) {
          batch.delete(doc(db, resource, id as string));
        }
        await batch.commit();

        data.push(...(params.ids as string[]));
      } catch (ex: any) {
        logger(ex.message);
      }

      return {
        data,
      };
    };
  }

  return defaultQuery(resource, params);
});
