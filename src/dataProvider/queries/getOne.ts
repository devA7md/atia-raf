import { DataProvider, GetOneParams, GetOneResult } from "react-admin";
import { doc, getDoc } from "firebase/firestore";
import { curry } from "ramda";

import { CustomDataProvider, DataProviderModules } from "../../types";
import { injectMetaDataToRecord } from "../../utils";

type GetOne = DataProvider["getOne"];

export const getOne = curry<
  (
    dataProviderModules: DataProviderModules,
    customDataProvider: CustomDataProvider,
    resource: string,
    params: GetOneParams
  ) => ReturnType<GetOne>
>(async ({ db, logger }, customDataProvider, resource, params) => {
  logger(resource, params);

  let defaultQuery: GetOne;

  if (customDataProvider[resource]?.getOne) {
    defaultQuery = customDataProvider[resource].getOne!;
  } else {
    defaultQuery = async (resource, params): Promise<GetOneResult> => {
      let data: Record<string, any> = {};

      try {
        const snapshot = await getDoc(doc(db, resource, params.id));
        if (snapshot.exists()) {
          data = injectMetaDataToRecord(snapshot);
        }
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
