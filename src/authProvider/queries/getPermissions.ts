import { AuthProvider } from "react-admin";
import { curry } from "ramda";

import { AuthProviderModules, CustomAuthProvider } from "../../types";
import { checkAuthedUser } from "../utils";

type GetPermissions = AuthProvider["getPermissions"];

export const getPermissions = curry<
  (
    authProviderModules: AuthProviderModules,
    customAuthProvider: CustomAuthProvider,
    params: any
  ) => ReturnType<GetPermissions>
>(({ auth, logger }, customAuthProvider, params) => {
  let defaultQuery: GetPermissions;

  if (customAuthProvider.getPermissions) defaultQuery = customAuthProvider.getPermissions;
  else
    defaultQuery = async () => {
      try {
        return await checkAuthedUser({ auth, logger });
      } catch (ex: any) {
        logger(ex.message);
      }
    };

  return defaultQuery(params);
});
