import { FirebaseOptions, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

import authProvider from "../authProvider";
import dataProvider from "../dataProvider";
import { Options } from "../types";
import { defaultOptions } from "../options";
import { getLogger } from "../utils";

export const configureApp = (firebaseOptions: FirebaseOptions, userOptions?: Options) => {
  const app = initializeApp(firebaseOptions);

  const auth = getAuth(app);
  const db = getFirestore(app);
  const storage = getStorage(app);

  const options = userOptions ?? defaultOptions;
  const logger = getLogger(options.log);

  const getAuthProvider = authProvider({ auth, options, logger });
  const getDataProvider = dataProvider({
    db,
    storage,
    options,
    logger,
  });

  return {
    app,
    auth,
    db,
    storage,
    getAuthProvider,
    getDataProvider,
  };
};
