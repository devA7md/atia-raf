import { AuthProvider } from "react-admin";
import { signInWithEmailAndPassword } from "firebase/auth";
import { curry } from "ramda";

import { AuthProviderModules, CustomAuthProvider } from "../../types";

type Login = AuthProvider["login"];

export const login = curry<
  (authProviderModules: AuthProviderModules, customAuthProvider: CustomAuthProvider, params: any) => ReturnType<Login>
>(({ auth, logger }, customAuthProvider, params) => {
  logger(params);

  let defaultQuery: Login;

  if (customAuthProvider.login) defaultQuery = customAuthProvider.login;
  else
    defaultQuery = async (params: any) => {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, params.username, params.password);
        logger(userCredential.user);
      } catch (ex: any) {
        logger("[login error]: ", ex.message);
        throw new Error(ex);
      }
    };

  return defaultQuery(params);
});
