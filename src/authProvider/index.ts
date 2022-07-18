import { AuthProvider } from "react-admin";
import { curry } from "ramda";

import { AuthProviderModules, CustomAuthProvider } from "../types";
import { checkAuth, checkError, getIdentity, getPermissions, login, logout } from "./queries";

const authProvider = curry<
  (authProviderModules: AuthProviderModules, customAuthProvider: CustomAuthProvider) => AuthProvider
>((authProviderModules, customAuthProvider) => {
  return {
    login: login(authProviderModules, customAuthProvider),
    logout: logout(authProviderModules, customAuthProvider),
    checkAuth: checkAuth(authProviderModules, customAuthProvider),
    checkError: checkError(authProviderModules, customAuthProvider),
    getIdentity: getIdentity(authProviderModules, customAuthProvider),
    getPermissions: getPermissions(authProviderModules, customAuthProvider),
  };
});

export default authProvider;
