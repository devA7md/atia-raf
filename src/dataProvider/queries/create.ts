import { CreateParams, CreateResult, DataProvider } from "react-admin";
import { addDoc, collection } from "firebase/firestore";
import { curry } from "ramda";

import { CustomDataProvider, DataProviderModules } from "../../types";
import { deleteFiles, fileUploader, prepareDataUploads, UploadedRefs } from "../helpers/fileUploader";
import { applyCreateTimestamp } from "../../utils";

type Create = DataProvider["create"];

export const create = curry<
  (
    dataProviderModules: DataProviderModules,
    customDataProvider: CustomDataProvider,
    resource: string,
    params: CreateParams
  ) => ReturnType<Create>
>(async ({ db, storage, logger }, customDataProvider, resource, params) => {
  logger(resource, params);

  let defaultQuery: Create;

  if (customDataProvider[resource]?.create) {
    defaultQuery = customDataProvider[resource].create!;
  } else {
    defaultQuery = async (resource, params): Promise<CreateResult> => {
      let data: Record<string, any> = { id: "" };
      let uploadedRefs: UploadedRefs = {};

      try {
        const uploads = prepareDataUploads(params.data);
        const { dataWithUploadedFiles, ...rest } = await fileUploader({
          logger,
          storage,
          fileUploaderData: {
            resource,
            uploads,
            originalData: params.data,
          },
        });
        uploadedRefs = rest.uploadedRefs;

        if (dataWithUploadedFiles) {
          const result = await addDoc(collection(db, resource), applyCreateTimestamp(dataWithUploadedFiles));
          data = { id: result.id };
        }
      } catch (ex: any) {
        logger(ex.message);
        await deleteFiles({ fileRefs: uploadedRefs, logger });
        throw new Error(ex);
      }

      return {
        data,
      };
    };
  }

  return defaultQuery(resource, params);
});
