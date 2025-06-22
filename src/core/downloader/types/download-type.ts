type DownloadType = "audio" | "video";
export default DownloadType;

export interface DownloadTypeInfo {
  fileExtension: string;
  formatInfo: FormatInfo;
}

export type FormatInfo = "audioonly" | "videoandaudio";
