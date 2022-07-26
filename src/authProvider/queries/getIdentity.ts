import { AuthProvider } from "react-admin";

import { AuthProviderModules, CustomAuthProvider } from "../../types";
import { checkAuthedUser } from "../utils";

type GetIdentity = Exclude<AuthProvider["getIdentity"], undefined>;

export const getIdentity = (
  { auth, logger }: AuthProviderModules,
  customAuthProvider: CustomAuthProvider
): GetIdentity => {
  let defaultQuery: GetIdentity;

  if (customAuthProvider.getIdentity) defaultQuery = customAuthProvider.getIdentity;
  else
    defaultQuery = async () => {
      try {
        const user = await checkAuthedUser({ auth, logger });
        if (user) {
          return Promise.resolve({
            id: user.uid,
            fullName: user.displayName,
            avatar: user.photoURL,
          });
        } else {
          return Promise.resolve({
            id: "",
          });
        }
      } catch (ex: any) {
        logger("[getIdentity error]: ", ex);
        return Promise.reject(ex);
      }
    };

  return defaultQuery;
};
