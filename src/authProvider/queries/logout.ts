import { AuthProvider } from "react-admin";
import { curry } from "ramda";

import { AuthProviderModules, CustomAuthProvider } from "../../types";

type Logout = AuthProvider["logout"];

export const logout = curry<
  (authProviderModules: AuthProviderModules, customAuthProvider: CustomAuthProvider, params: any) => ReturnType<Logout>
>(({ auth, logger }, customAuthProvider, params) => {
  let defaultQuery: Logout;

  if (customAuthProvider.checkAuth) defaultQuery = customAuthProvider.checkAuth;
  else
    defaultQuery = async (params: any) => {
      logger("[logout params]: ", params);

      try {
        await auth.signOut();
      } catch (ex: any) {
        logger("[logout error]: ", ex.message);
      }
    };

  return defaultQuery(params);
});
