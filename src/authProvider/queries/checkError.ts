import { AuthProvider } from "react-admin";
import { curry } from "ramda";

import { AuthProviderModules, CustomAuthProvider } from "../../types";

type CheckError = AuthProvider["checkError"];

export const checkError = curry<
  (
    authProviderModules: AuthProviderModules,
    customAuthProvider: CustomAuthProvider,
    error: any
  ) => ReturnType<CheckError>
>(({ logger }, customAuthProvider, error) => {
  let defaultQuery: CheckError;

  if (customAuthProvider.checkError) defaultQuery = customAuthProvider.checkError;
  else {
    defaultQuery = async (error: any) => {
      logger("[checkError]: ", error);

      const status = error.status;
      if (status === 401 || status === 403) return Promise.reject();
      return Promise.resolve();
    };
  }

  return defaultQuery(error);
});
