import fs from "fs";
import { ArgumentsCamelCase } from "yargs";
import SettingsManager from "../core/SettingsManager";
import YTDownloader from "../core/YTDownloader";
import { DownloadFlags } from "../types/interface";

export function handleVideoDownloadCommand(argv: ArgumentsCamelCase<DownloadFlags>) {
  let saveDir = SettingsManager.downloadDirectory;
  if (argv.dir && fs.existsSync(argv.dir)) {
    saveDir = argv.dir;
  } else if (argv.dir && !fs.existsSync(argv.dir)) {
    SettingsManager.showError(`"${argv.dir}" is not a valid directory`);
  }

  YTDownloader.shouldGenerateLogs = SettingsManager.shouldGenerateLogs;
  if (YTDownloader.shouldGenerateLogs)
    console.log("*Generating logs for downloaded files\n");

  // Download
  if (argv.queue) {
    YTDownloader.downloadQueue(argv.queue, saveDir);
  } else YTDownloader.downloadVideo(argv.url, saveDir);
}
