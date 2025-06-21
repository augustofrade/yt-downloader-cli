export const configFileSchema = {
  id: "/ConfigFile",
  type: "object",
  properties: {
    downloadDirectory: {
      type: "string",
    },
    defaultFileFormat: {
      type: "string",
    },
    generateLogs: {
      type: "boolean",
    },
  },
  required: ["downloadDirectory", "generateLogs", "defaultFileFormat"],
};
