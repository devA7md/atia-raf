import { AuthProvider, DataProvider } from "react-admin";
import { Firestore } from "firebase/firestore";
import { FirebaseStorage } from "firebase/storage";
import { Auth } from "firebase/auth";

import { Options } from "./options";

export * from "./options";

export type Resource = string;
export type CustomDataProvider = Record<Resource, Partial<DataProvider>>;
export type CustomAuthProvider = Partial<AuthProvider>;

export interface DataProviderModules {
  db: Firestore;
  storage: FirebaseStorage;
  options: Options;
  logger: (...args: any) => void;
}

export interface AuthProviderModules {
  auth: Auth;
  options: Options;
  logger: (...args: any) => void;
}
