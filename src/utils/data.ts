import { DocumentSnapshot } from "firebase/firestore";

export const injectMetaDataToRecord = (snapshot: DocumentSnapshot, addMeta = false) => {
  let data: Record<string, any> = {
    ...snapshot.data(),
    id: snapshot.id,
  };

  if (addMeta) {
    data = {
      ...data,
      __meta: {
        ref: snapshot.ref,
      },
    };
  }

  return data;
};
