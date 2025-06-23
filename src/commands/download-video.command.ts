import fs from "fs";
import { ArgumentsCamelCase } from "yargs";
import ConfigurationManager from "../core/configuration/ConfigurationManager";
import YTDownloader from "../core/downloader/YTDownloader";
import ConsoleLogger from "../helpers/ConsoleLogger";
import { DownloadFlags } from "../types/interface";
import { getYoutubeVideoId } from "../core/downloader/helpers/get-youtube-video-id";

export function handleVideoDownloadCommand(argv: ArgumentsCamelCase<DownloadFlags>) {
  let saveDir = ConfigurationManager.downloadDirectory;
  if (argv.dir && fs.existsSync(argv.dir)) {
    saveDir = argv.dir;
  } else if (argv.dir && !fs.existsSync(argv.dir)) {
    ConsoleLogger.showError(`"${argv.dir}" is not a valid directory`);
  }

  const videoIdResult = getYoutubeVideoId(argv.url);
  if (!videoIdResult.isSuccess()) {
    ConsoleLogger.showError(videoIdResult.error);
    return;
  }

  const validTypes = ["audio", "video"];
  if (!validTypes.includes(argv.type)) {
    argv.type = "audio";
  }

  YTDownloader.shouldGenerateLogs = ConfigurationManager.shouldGenerateLogs;
  if (YTDownloader.shouldGenerateLogs)
    console.log("*Generating logs for downloaded files\n");

  // Download
  if (argv.queue) {
    YTDownloader.downloadQueue(argv.queue, saveDir, argv.type);
  } else YTDownloader.downloadVideo(argv.url, saveDir, argv.type);
}
