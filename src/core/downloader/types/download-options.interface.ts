import { DownloadTypeInfo } from "./download-type";

export interface DownloadOptions {
  dir: string;
  url: string;
  downloadTypeInfo: DownloadTypeInfo;
}
