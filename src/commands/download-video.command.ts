import fs from "fs";
import { ArgumentsCamelCase } from "yargs";
import SettingsManager from "../SettingsManager";
import { DownloadFlags } from "../types/interface";
import YTDownloader from "../YTDownloader";

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
