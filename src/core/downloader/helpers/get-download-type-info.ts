import DownloadType, { DownloadTypeInfo } from "../types/download-type";

export default function getDownloadTypeInfo(
  downloadType: DownloadType
): DownloadTypeInfo {
  const acceptedTypes: Record<DownloadType, DownloadTypeInfo> = {
    audio: {
      fileExtension: "mp3",
      formatInfo: "audioonly",
    },
    video: {
      fileExtension: "mp4",
      formatInfo: "videoandaudio",
    },
  };

  return acceptedTypes[downloadType];
}
