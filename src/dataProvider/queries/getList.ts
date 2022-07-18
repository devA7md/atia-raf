import { DataProvider, GetListParams, GetListResult } from "react-admin";
import { collection, getDocs, limit, orderBy, OrderByDirection, query, where } from "firebase/firestore";
import { curry } from "ramda";

import { CustomDataProvider, DataProviderModules } from "../../types";
import { injectMetaDataToRecord } from "../../utils";

type GetList = DataProvider["getList"];

export const getList = curry<
  (
    dataProviderModules: DataProviderModules,
    customDataProvider: CustomDataProvider,
    resource: string,
    params: GetListParams
  ) => ReturnType<GetList>
>(async ({ db, logger }, customDataProvider, resource, params) => {
  logger(resource, params);

  let defaultQuery: GetList;

  if (customDataProvider[resource]?.getList) {
    defaultQuery = customDataProvider[resource].getList!;
  } else {
    defaultQuery = async (resource, params): Promise<GetListResult> => {
      let data: Record<string, any>[] = [];

      try {
        const {
          sort: { field, order },
          pagination: { perPage },
          filter,
        } = params;

        const queryConstraint = [limit(perPage)];

        if (field !== "id") {
          queryConstraint.push(orderBy(field, order.toLowerCase() as OrderByDirection));
        }

        if (Object.keys(filter).length) {
          queryConstraint.push(
            ...Object.entries<any>(filter).map(([fieldPath, value]) => where(fieldPath, "==", value))
          );
        }

        const snapshots = await getDocs(query(collection(db, resource), ...queryConstraint));
        data = snapshots.docs.map((snapshot) => injectMetaDataToRecord(snapshot, true));
      } catch (ex: any) {
        logger(ex.message);
      }

      return {
        data,
        total: undefined,
      };
    };
  }

  return defaultQuery(resource, params);
});
