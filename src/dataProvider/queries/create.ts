import { CreateParams, CreateResult, DataProvider } from "react-admin";
import { addDoc, collection } from "firebase/firestore";
import { curry } from "ramda";

import { CustomDataProvider, DataProviderModules } from "../../types";
import { deleteFiles, fileUploader } from "../helpers/fileUploader";
import { prepareDataUploads } from "../helpers/fileUploader/prepareData";
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

      const uploads = prepareDataUploads(params.data);
      const { dataWithUploadedFiles, uploadedRefs } = await fileUploader(storage, {
        resource,
        uploads,
        originalData: params.data,
      });

      try {
        if (dataWithUploadedFiles) {
          const result = await addDoc(collection(db, resource), applyCreateTimestamp(dataWithUploadedFiles));

          data = { id: result.id };
        }
      } catch (ex: any) {
        logger(ex.message);
        deleteFiles(uploadedRefs);
      }

      return {
        data,
      };
    };
  }

  return defaultQuery(resource, params);
});
