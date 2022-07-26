import { AuthProvider } from "react-admin";
import { curry } from "ramda";

import { AuthProviderModules, CustomAuthProvider } from "../../types";
import { checkAuthedUser } from "../utils";

type CheckAuth = AuthProvider["checkAuth"];

export const checkAuth = curry<
  (
    authProviderModules: AuthProviderModules,
    customAuthProvider: CustomAuthProvider,
    params: any
  ) => ReturnType<CheckAuth>
>(({ auth, logger }, customAuthProvider, params) => {
  let defaultQuery: CheckAuth;

  if (customAuthProvider.checkAuth) defaultQuery = customAuthProvider.checkAuth;
  else
    defaultQuery = async (params: any) => {
      logger("[checkAuth params]: ", { params });

      try {
        await checkAuthedUser({ auth, logger });
        return Promise.resolve();
      } catch (ex: any) {
        logger("[checkAuth error]: ", ex);
        return Promise.reject(ex);
      }
    };

  return defaultQuery(params);
});
