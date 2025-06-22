export const configFileSchema = {
  id: "/ConfigFile",
  type: "object",
  properties: {
    downloadDirectory: {
      type: "string",
    },
    downloadType: {
      type: "string",
    },
    generateLogs: {
      type: "boolean",
    },
  },
  required: ["downloadDirectory", "generateLogs", "downloadType"],
};
