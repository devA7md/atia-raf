import { DataProvider, DeleteParams, DeleteResult } from "react-admin";
import { deleteDoc, doc } from "firebase/firestore";
import { curry } from "ramda";

import { CustomDataProvider, DataProviderModules } from "../../types";

type Delete = DataProvider["delete"];

export const deleteQuery = curry<
  (
    dataProviderModules: DataProviderModules,
    customDataProvider: CustomDataProvider,
    resource: string,
    params: DeleteParams
  ) => ReturnType<Delete>
>(async ({ db, logger }, customDataProvider, resource, params) => {
  logger(resource, params);

  let defaultQuery: Delete;

  if (customDataProvider[resource]?.delete) {
    defaultQuery = customDataProvider[resource].delete!;
  } else {
    defaultQuery = async (resource, params): Promise<DeleteResult> => {
      let data: Record<string, any> = { id: "" };

      try {
        await deleteDoc(doc(db, resource, params.id as string));
        data = { id: params.id };
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
