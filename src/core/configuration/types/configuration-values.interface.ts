import DownloadType from "../../downloader/types/download-type";

export interface ConfigurationValues {
  downloadDirectory: string;
  generateLogs: boolean;
  downloadType: DownloadType;
}
