import { DataProvider, GetManyReferenceParams, GetManyReferenceResult } from "react-admin";
import { collection, getDocs, limit, orderBy, OrderByDirection, query, where } from "firebase/firestore";
import { curry } from "ramda";

import { CustomDataProvider, DataProviderModules } from "../../types";
import { addIdToDocument } from "../../utils";

type GetManyReference = DataProvider["getManyReference"];

export const getManyReference = curry<
  (
    dataProviderModules: DataProviderModules,
    customDataProvider: CustomDataProvider,
    resource: string,
    params: GetManyReferenceParams
  ) => ReturnType<GetManyReference>
>(async ({ db, logger }, customDataProvider, resource, params) => {
  logger(resource, params);

  let defaultQuery: GetManyReference;

  if (customDataProvider[resource]?.getManyReference) {
    defaultQuery = customDataProvider[resource].getManyReference!;
  } else {
    defaultQuery = async (resource, params): Promise<GetManyReferenceResult> => {
      let data: Record<string, any>[] = [];

      try {
        const {
          target,
          id,
          sort: { field, order },
          pagination: { perPage },
          filter,
        } = params;

        const queryConstraint = [where(target, "==", id), limit(perPage)];

        if (field !== "id") {
          queryConstraint.push(orderBy(field, order.toLowerCase() as OrderByDirection));
        }

        if (Object.keys(filter).length) {
          queryConstraint.push(
            ...Object.entries<any>(filter).map(([fieldPath, value]) => where(fieldPath, "==", value))
          );
        }

        const snapshots = await getDocs(query(collection(db, resource), ...queryConstraint));
        data = snapshots.docs.map(addIdToDocument);
      } catch (ex: any) {
        logger(ex.message);
        throw new Error(ex);
      }

      return {
        data,
        total: undefined,
      };
    };
  }

  return defaultQuery(resource, params);
});
