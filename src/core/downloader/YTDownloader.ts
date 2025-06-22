import ytdl from "@distube/ytdl-core";
import chalk from "chalk";
import fs from "fs";
import path from "path";
import ProgressBar from "progress";
import sanitize from "sanitize-filename";

import ConsoleLogger from "../../helpers/ConsoleLogger";
import { formatBytes } from "../../helpers/format-bytes";
import { DownloadOptions, VideoInfo } from "../../types/interface";
import { Result } from "../../types/result";
import { FilterFormat } from "../../types/types";
import ConfigurationManager from "../configuration/ConfigurationManager";

export default class YTDownloader {
  public static shouldGenerateLogs = false;

  public static async downloadVideo(url: string, dir: string): Promise<void> {
    // TODO: make format dynamic
    const result = await this.getVideoInfo(url, "audioonly");
    if (!result.isSuccess()) {
      ConsoleLogger.showError(result.error);
    } else {
      await this.execDownload(result.data, { dir, url, format: "mp3" });
    }
  }

  private static async getVideoInfo(
    url: string,
    format: FilterFormat
  ): Promise<Result<VideoInfo>> {
    if (!ytdl.validateURL(url)) {
      return Result.Failure<VideoInfo>("Invalid URL passed");
    }

    const info = await ytdl.getInfo(url);
    const videoFormat = ytdl.chooseFormat(info.formats, { filter: format });
    const details = info.videoDetails;

    return Result.Success<VideoInfo>({
      title: details.title,
      channelName: details.author.name,
      bytes: videoFormat.contentLength,
    });
  }

  private static execDownload(
    videoInfo: VideoInfo,
    downloadOptions: DownloadOptions
  ): Promise<void> {
    const { dir, url, format } = downloadOptions;
    return new Promise((resolve, reject) => {
      console.log(
        `Downloading ${chalk.green(videoInfo.title)} by ${chalk.green(videoInfo.channelName)}`
      );
      try {
        const bufferBytes: Uint8Array[] = [];
        // TODO: make format dynamic
        const req = ytdl(url, { filter: "audioonly" });
        var bar = new ProgressBar("  Progress: [:bar] :rate/mbps :percent :etas", {
          complete: "=",
          incomplete: " ",
          width: 20,
          total: parseInt(videoInfo.bytes),
        });

        req.on("data", (data: Uint8Array) => {
          bufferBytes.push(data);
          bar.tick(data.length);
        });
        req.on("end", () => {
          const buffer: Buffer = Buffer.concat(bufferBytes);
          const fullDir = path.join(dir, `${sanitize(videoInfo.title)}.${format}`);
          fs.writeFileSync(fullDir, buffer, "binary");
          console.log(`Finished downloading ${formatBytes(videoInfo.bytes)}.\n`);

          if (this.shouldGenerateLogs) ConfigurationManager.generateLog(videoInfo);

          resolve();
        });
      } catch (e) {
        console.log(chalk.bgRed(`Error downloading ${videoInfo.title}`));
        reject();
      }
    });
  }

  static async downloadQueue(urls: string[], dir: string) {
    for (let i = 0; i < urls.length; i++) {
      await this.downloadVideo(urls[i], dir);
    }
  }
}
