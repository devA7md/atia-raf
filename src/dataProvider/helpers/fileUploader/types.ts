import { StorageReference } from "firebase/storage";

export interface Upload {
  fieldPath: string;
  fileData: {
    path: string;
    scr: string;
    rawFile: File;
  };
  ref?: StorageReference;
}

export interface FileUploaderData {
  resource: string;
  uploads: Upload[];
  originalData: Record<string, any>;
}

export type UploadedRefs = Record<string, StorageReference>;

export interface FileUploaderReturn {
  dataWithUploadedFiles: Record<string, any> | null;
  uploadedRefs: UploadedRefs;
}
