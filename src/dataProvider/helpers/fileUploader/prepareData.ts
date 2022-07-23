import { FirebaseStorage, ref } from "firebase/storage";
import { path } from "ramda";

import { Upload, UploadedRefs } from "./types";

export const prepareDataUploads = (data: Record<string, any>) => {
  const uploads: Upload[] = [];
  for (const [key, value] of Object.entries(data)) {
    parseDataRecursively(key, value, uploads);
  }

  return uploads;
};

export const parseDataRecursively = (fieldPath: string, value: any, uploads: Upload[]): any => {
  // check primitive value
  if (!value || typeof value !== "object") return value;

  // check timestamp value
  if (value.toDate && typeof value.toDate === "function") return value.toDate();

  // check input file value
  if (typeof value === "object" && Object.prototype.hasOwnProperty.call(value, "rawFile")) {
    uploads.push({
      fieldPath,
      fileData: value,
    });
    return;
  }

  // parse data again if the value is an array
  if (Array.isArray(value)) {
    value.forEach((entry: any, index: number) => parseDataRecursively(`${fieldPath}.${index}`, entry, uploads));
    return;
  }

  // case of the value is a normal object
  Object.entries(value).forEach(([nestedFieldPath, nestedValue]) => {
    return parseDataRecursively(`${fieldPath}.${nestedFieldPath}`, nestedValue, uploads);
  });
};

export const getPreviousFileRefs = ({
  uploadedRefs,
  storage,
  previousData,
}: {
  uploadedRefs: UploadedRefs;
  previousData: Record<string, any>;
  storage: FirebaseStorage;
}) => {
  return Object.keys(uploadedRefs).reduce((acc, key) => {
    return {
      ...acc,
      [key]: ref(storage, path<any>(key.split("."), previousData).path),
    };
  }, {});
};
