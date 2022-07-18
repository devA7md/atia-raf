import { deleteObject, FirebaseStorage, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { assocPath, clone } from "ramda";

import { FileUploaderData, FileUploaderReturn, UploadRef } from "./types";

export const fileUploader = async (
  storage: FirebaseStorage,
  fileUploaderData: FileUploaderData
): Promise<FileUploaderReturn> => {
  const uploadedRefs: UploadRef = {};
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
      console.log(ex.message);
      clonedOriginalData = fileUploaderData.originalData;
    }
  }

  return {
    dataWithUploadedFiles: clonedOriginalData,
    uploadedRefs,
  };
};

export const deleteFiles = (fileRefs: UploadRef) => {
  const deletedFiles = Object.values(fileRefs).map((ref) => deleteObject(ref));
  Promise.all(deletedFiles)
    .then(() => {
      console.log("Unwanted files have been deleted");
    })
    .catch((ex: any) => {
      console.log(ex.message);
    });
};
