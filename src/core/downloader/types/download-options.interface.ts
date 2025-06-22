import { FileFormat } from "../../../types/types";

export interface DownloadOptions {
  dir: string;
  url: string;
  format: FileFormat;
}
