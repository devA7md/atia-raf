import { DataProvider } from "react-admin";
import { curry } from "ramda";

import { CustomDataProvider, DataProviderModules } from "../types";
import {
  create,
  deleteMany,
  deleteQuery,
  getList,
  getMany,
  getManyReference,
  getOne,
  update,
  updateMany,
} from "./queries";

const dataProvider = curry<
  (dataProviderModules: DataProviderModules, customDataProvider: CustomDataProvider) => DataProvider
>((firebaseModules, customDataProvider) => {
  return {
    getList: getList(firebaseModules, customDataProvider),
    getOne: getOne(firebaseModules, customDataProvider),
    getMany: getMany(firebaseModules, customDataProvider),
    getManyReference: getManyReference(firebaseModules, customDataProvider),
    create: create(firebaseModules, customDataProvider),
    update: update(firebaseModules, customDataProvider),
    updateMany: updateMany(firebaseModules, customDataProvider),
    delete: deleteQuery(firebaseModules, customDataProvider),
    deleteMany: deleteMany(firebaseModules, customDataProvider),
  };
});

export default dataProvider;
