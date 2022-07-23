import { initializeTestEnvironment, TestEnvironmentConfig } from "@firebase/rules-unit-testing";

const config: TestEnvironmentConfig = {
  projectId: "project-id-which-is-unique",
  firestore: {
    host: "localhost",
    port: 5000,
  },
  storage: { host: "localhost", port: 6000 },
};

export const initTest = async (requireAuth = false) => {
  const testEnvironment = await initializeTestEnvironment(config);
  const authedContext = testEnvironment.authenticatedContext("username");
  const unAuthedContext = testEnvironment.unauthenticatedContext();

  const db = requireAuth ? authedContext.firestore() : unAuthedContext.firestore();
  const storage = requireAuth ? authedContext.storage() : unAuthedContext.storage();

  return {
    db,
    storage,
    clearFirestore: testEnvironment.clearFirestore.bind(testEnvironment),
    clearStorage: testEnvironment.clearStorage.bind(testEnvironment),
  };
};
