import { FileFormat } from "../../../types/types";

export interface ConfigurationOptions {
  dir: string;
  logs: boolean;
  format: FileFormat;
}
