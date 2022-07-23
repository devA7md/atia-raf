import { DataProvider, UpdateParams, UpdateResult } from "react-admin";
import { doc, updateDoc } from "firebase/firestore";
import { curry, omit } from "ramda";

import { CustomDataProvider, DataProviderModules } from "../../types";
import {
  deleteFiles,
  fileUploader,
  getPreviousFileRefs,
  prepareDataUploads,
  UploadedRefs,
} from "../helpers/fileUploader";
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
      let uploadedRefs: UploadedRefs = {};

      try {
        const uploads = prepareDataUploads(params.data);
        const { dataWithUploadedFiles, ...rest } = await fileUploader({
          logger,
          storage,
          fileUploaderData: {
            resource,
            uploads,
            originalData: omit(["id"])(params.data),
          },
        });
        uploadedRefs = rest.uploadedRefs;

        if (dataWithUploadedFiles) {
          await updateDoc(doc(db, resource, params.id as string), applyUpdateTimestamp(dataWithUploadedFiles));

          // delete old files if user replaced its value with new one
          deleteFiles({
            logger,
            fileRefs: getPreviousFileRefs({ uploadedRefs, previousData: params.previousData, storage }),
          });
        }
      } catch (ex: any) {
        logger(ex.message);
        await deleteFiles({ fileRefs: uploadedRefs, logger });
        throw new Error(ex);
      }

      return {
        data: { id: params.id },
      };
    };
  }

  return defaultQuery(resource, params);
});
