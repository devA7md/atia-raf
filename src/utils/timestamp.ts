import { serverTimestamp } from "firebase/firestore";
import { curry } from "ramda";

enum ApplyTimestampType {
  update = "update",
  create = "create",
}

// todo - pass timestamp keys instead of hard coded ones `updatedAt` & `createdAt`
const applyTimestamps = curry((type: ApplyTimestampType, data: Record<string, any>) => {
  if (type === ApplyTimestampType.update) {
    return {
      ...data,
      updatedAt: serverTimestamp(),
    };
  } else {
    return {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
  }
});

export const applyCreateTimestamp = applyTimestamps(ApplyTimestampType.create);
export const applyUpdateTimestamp = applyTimestamps(ApplyTimestampType.update);
