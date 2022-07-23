import { FirebaseStorage, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { assocPath, clone } from "ramda";

import { FileUploaderData, FileUploaderReturn, UploadedRefs } from "./types";
import { Logger } from "../../../types";
import { deleteFiles } from "./deleteFiles";

export const fileUploader = async ({
  fileUploaderData,
  storage,
  logger,
}: {
  storage: FirebaseStorage;
  fileUploaderData: FileUploaderData;
  logger: Logger;
}): Promise<FileUploaderReturn> => {
  const uploadedRefs: UploadedRefs = {};
  let clonedOriginalData = clone(fileUploaderData.originalData);

  for (const upload of fileUploaderData.uploads) {
    const fileRef = ref(storage, `${fileUploaderData.resource}/${upload.fileData.path}`);
    const splitPath = upload.fieldPath.split(".").map((segment) => (isNaN(+segment) ? segment : +segment));

    try {
      const result = await uploadBytes(fileRef, upload.fileData.rawFile);
      const downloadUrl = await getDownloadURL(result.ref);

      // replace uploaded file with its metadata according to it's path
      clonedOriginalData = assocPath(
        splitPath,
        {
          src: downloadUrl,
          path: result.metadata.fullPath,
        },
        clonedOriginalData
      );

      uploadedRefs[upload.fieldPath] = result.ref;
    } catch (ex: any) {
      logger(ex.message);
      clonedOriginalData = fileUploaderData.originalData;
      await deleteFiles({ fileRefs: uploadedRefs, logger });
      throw new Error(ex);
    }
  }

  return {
    dataWithUploadedFiles: clonedOriginalData,
    uploadedRefs,
  };
};
