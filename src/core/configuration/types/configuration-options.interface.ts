import DownloadType from "../../downloader/types/download-type";

export interface ConfigurationOptions {
  dir: string;
  logs: boolean;
  type: DownloadType;
}
