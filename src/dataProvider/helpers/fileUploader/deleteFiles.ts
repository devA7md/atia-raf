import { deleteObject } from "firebase/storage";

import { UploadedRefs } from "./types";
import { Logger } from "../../../types";

export const deleteFiles = ({ logger, fileRefs }: { logger: Logger; fileRefs: UploadedRefs }) => {
  const deletedFiles = Object.values(fileRefs).map((ref) => deleteObject(ref));
  return Promise.all(deletedFiles)
    .then(() => {
      logger("Unwanted files have been deleted");
    })
    .catch((ex: any) => {
      logger(ex.message);
    });
};
