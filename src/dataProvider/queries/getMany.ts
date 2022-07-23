import { DataProvider, GetManyParams, GetManyResult } from "react-admin";
import { doc, getDoc } from "firebase/firestore";
import { curry } from "ramda";

import { CustomDataProvider, DataProviderModules } from "../../types";
import { addIdToDocument } from "../../utils";

type GetMany = DataProvider["getMany"];

export const getMany = curry<
  (
    dataProviderModules: DataProviderModules,
    customDataProvider: CustomDataProvider,
    resource: string,
    params: GetManyParams
  ) => ReturnType<GetMany>
>(async ({ db, logger }, customDataProvider, resource, params) => {
  logger(resource, params);

  let defaultQuery: GetMany;

  if (customDataProvider[resource]?.getMany) {
    defaultQuery = customDataProvider[resource].getMany!;
  } else {
    defaultQuery = async (resource, params): Promise<GetManyResult> => {
      const data: Record<string, any>[] = [];

      try {
        for (const id of params.ids) {
          const snapshot = await getDoc(doc(db, resource, id as string));
          if (snapshot.exists()) data.push(addIdToDocument(snapshot));
        }
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
