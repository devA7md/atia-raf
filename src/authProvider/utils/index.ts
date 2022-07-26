import { Auth, onAuthStateChanged, User } from "firebase/auth";

import { Logger } from "../../types";

export const checkAuthedUser = ({ auth, logger }: { auth: Auth; logger: Logger }) => {
  return new Promise<User | null>((resolve, reject) => {
    const unsubscribeToAuthChange = onAuthStateChanged(auth, {
      next(currentUser) {
        unsubscribeToAuthChange();
        if (currentUser) resolve(currentUser);
        else reject("User not found");
      },
      error(ex) {
        logger("[checkAuthedUser error]: ", ex.message);
        unsubscribeToAuthChange();
        reject(ex.message);
      },
      complete() {
        // do nothing!
      },
    });
  });
};
