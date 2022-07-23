import { DocumentSnapshot } from "firebase/firestore";

export const addIdToDocument = (snapshot: DocumentSnapshot) => {
  return {
    ...snapshot.data(),
    id: snapshot.id,
  };
};
