import { DataProvider, UpdateParams, UpdateResult } from "react-admin";
import { doc, updateDoc } from "firebase/firestore";
import { ref } from "firebase/storage";
import { curry, omit, path } from "ramda";

import { CustomDataProvider, DataProviderModules } from "../../types";
import { prepareDataUploads } from "../helpers/fileUploader/prepareData";
import { deleteFiles, fileUploader } from "../helpers/fileUploader";
import { applyUpdateTimestamp } from "../../utils";

type Update = DataProvider["update"];

export const update = curry<
  (
    dataProviderModules: DataProviderModules,
    customDataProvider: CustomDataProvider,
    resource: string,
    params: UpdateParams
  ) => ReturnType<Update>
>(async ({ db, storage, logger }, customDataProvider, resource, params) => {
  logger(resource, params);

  let defaultQuery: Update;

  if (customDataProvider[resource]?.update) {
    defaultQuery = customDataProvider[resource].update!;
  } else {
    defaultQuery = async (resource, params): Promise<UpdateResult> => {
      const uploads = prepareDataUploads(params.data);
      const { dataWithUploadedFiles, uploadedRefs } = await fileUploader(storage, {
        resource,
        uploads,
        originalData: omit(["id"])(params.data),
      });

      try {
        if (dataWithUploadedFiles) {
          await updateDoc(doc(db, resource, params.id as string), applyUpdateTimestamp(dataWithUploadedFiles));

          // delete old files if user replaced its value with new one
          deleteFiles(
            Object.keys(uploadedRefs).reduce((acc, key) => {
              return {
                ...acc,
                [key]: ref(storage, path<any>(key.split("."), params.previousData).path),
              };
            }, {})
          );
        }
      } catch (ex: any) {
        logger(ex.message);
        deleteFiles(uploadedRefs);
      }

      return {
        data: { id: params.id },
      };
    };
  }

  return defaultQuery(resource, params);
});
