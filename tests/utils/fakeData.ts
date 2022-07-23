export const customDocument = {
  id: "custom_id",
  name: "custom_name",
};

export const generateFakeDocuments = (documentsCount: number, additionalDocumentFields: Record<string, any> = {}) => [
  // subtract 1 as we added it as a custom document below
  // so that total generated documents count is `documentsCount`
  ...Array(documentsCount - 1)
    .fill(undefined)
    .map(() => ({
      id: Math.ceil(Math.random() * 1e10).toString(),
      name: (Math.random() * 1e25).toString(36),
      ...additionalDocumentFields,
    })),
  {
    ...customDocument,
    ...additionalDocumentFields,
  },
];
