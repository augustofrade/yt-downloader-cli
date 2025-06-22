import { FileFormat } from "../../../types/types";

export interface ConfigurationValues {
  downloadDirectory: string;
  generateLogs: boolean;
  defaultFileFormat: FileFormat;
}
