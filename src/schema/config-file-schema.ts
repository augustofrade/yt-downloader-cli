export const configFileSchema = {
  id: "/ConfigFile",
  type: "object",
  properties: {
    saveDirectory: {
      type: "string",
    },
    defaultFileFormat: {
      type: "string",
    },
    generateLogs: {
      type: "boolean",
    },
  },
  required: ["saveDirectory", "generateLogs", "defaultFileFormat"],
};
