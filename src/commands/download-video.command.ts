import fs from "fs";
import { ArgumentsCamelCase } from "yargs";
import ConfigurationManager from "../core/ConfigurationManager";
import YTDownloader from "../core/YTDownloader";
import { DownloadFlags } from "../types/interface";

export function handleVideoDownloadCommand(argv: ArgumentsCamelCase<DownloadFlags>) {
  let saveDir = ConfigurationManager.downloadDirectory;
  if (argv.dir && fs.existsSync(argv.dir)) {
    saveDir = argv.dir;
  } else if (argv.dir && !fs.existsSync(argv.dir)) {
    ConfigurationManager.showError(`"${argv.dir}" is not a valid directory`);
  }

  YTDownloader.shouldGenerateLogs = ConfigurationManager.shouldGenerateLogs;
  if (YTDownloader.shouldGenerateLogs)
    console.log("*Generating logs for downloaded files\n");

  // Download
  if (argv.queue) {
    YTDownloader.downloadQueue(argv.queue, saveDir);
  } else YTDownloader.downloadVideo(argv.url, saveDir);
}
