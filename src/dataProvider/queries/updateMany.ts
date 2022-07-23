import { DataProvider, UpdateManyParams, UpdateManyResult } from "react-admin";
import { doc, writeBatch } from "firebase/firestore";
import { curry } from "ramda";

import { CustomDataProvider, DataProviderModules } from "../../types";
import { applyUpdateTimestamp } from "../../utils";

type UpdateMany = DataProvider["updateMany"];

export const updateMany = curry<
  (
    dataProviderModules: DataProviderModules,
    customDataProvider: CustomDataProvider,
    resource: string,
    params: UpdateManyParams
  ) => ReturnType<UpdateMany>
>(async ({ db, logger }, customDataProvider, resource, params) => {
  logger(resource, params);

  let defaultQuery: UpdateMany;

  if (customDataProvider[resource]?.updateMany) {
    defaultQuery = customDataProvider[resource].updateMany!;
  } else {
    defaultQuery = async (resource, params): Promise<UpdateManyResult> => {
      let data: string[] = [];

      const batch = writeBatch(db);

      try {
        for (const id of params.ids) {
          batch.update(doc(db, resource, id as string), applyUpdateTimestamp(params.data));
        }
        await batch.commit();
        data = params.ids as string[];
      } catch (ex: any) {
        logger(ex.message);
        throw new Error(ex);
      }

      return {
        data,
      };
    };
  }

  return defaultQuery(resource, params);
});
