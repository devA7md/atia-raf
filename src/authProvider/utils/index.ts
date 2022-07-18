import { Auth, onAuthStateChanged, User } from "firebase/auth";

export const checkAuthedUser = (auth: Auth) => {
  return new Promise<User | null>((resolve, reject) => {
    const unsubscribeToAuthChange = onAuthStateChanged(auth, {
      next(currentUser) {
        unsubscribeToAuthChange();
        if (currentUser) resolve(currentUser);
        else reject("User not found");
      },
      error(ex) {
        console.log(ex.message);
        unsubscribeToAuthChange();
        reject(ex.message);
      },
      complete() {
        // do nothing!
      },
    });
  });
};
