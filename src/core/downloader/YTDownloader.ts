import ytdl from "@distube/ytdl-core";
import chalk from "chalk";
import fs from "fs";
import path from "path";
import sanitize from "sanitize-filename";

import ProgressBar from "progress";
import ConsoleLogger from "../../helpers/ConsoleLogger";
import { formatBytes } from "../../helpers/format-bytes";
import { VideoInfo } from "../../types/interface";
import { Result } from "../../types/result";
import ConfigurationManager from "../configuration/ConfigurationManager";
import getDownloadTypeInfo from "./helpers/get-download-type-info";
import { DownloadOptions } from "./types/download-options.interface";
import DownloadType, { FormatInfo } from "./types/download-type";

export default class YTDownloader {
  public static shouldGenerateLogs = false;

  public static async downloadVideo(
    url: string,
    dir: string,
    downloadType: DownloadType
  ): Promise<void> {
    const downloadTypeInfo = getDownloadTypeInfo(downloadType);
    const result = await this.getVideoInfo(url, downloadTypeInfo.formatInfo);

    if (!result.isSuccess()) {
      ConsoleLogger.showError(result.error);
      return;
    }

    await this.execDownload(result.data, { dir, url, downloadTypeInfo });
  }

  private static async getVideoInfo(
    url: string,
    format: FormatInfo
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
    const { dir, url, downloadTypeInfo } = downloadOptions;
    return new Promise((resolve, reject) => {
      console.log(
        `Downloading ${chalk.green(videoInfo.title)} by ${chalk.green(videoInfo.channelName)}`
      );
      try {
        const bufferBytes: Uint8Array[] = [];

        const req = ytdl(url, {
          filter: downloadTypeInfo.formatInfo,
        });
        // TODO: get content length from videos with the "info" event and pass it to the bar.
        var bar =
          downloadTypeInfo.fileExtension === "mp3"
            ? new ProgressBar("  Progress: [:bar] :rate/mbps :percent :etas", {
                complete: "=",
                incomplete: " ",
                width: 20,
                total: parseInt(videoInfo.bytes),
              })
            : null;

        req.on("data", (data: Uint8Array) => {
          bufferBytes.push(data);
          bar?.tick(data.length);
        });
        req.on("end", () => {
          const buffer: Buffer = Buffer.concat(bufferBytes);
          const fullDir = path.join(
            dir,
            `${sanitize(videoInfo.title)}.${downloadTypeInfo.fileExtension}`
          );
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

  static async downloadQueue(urls: string[], dir: string, type: DownloadType) {
    for (let i = 0; i < urls.length; i++) {
      await this.downloadVideo(urls[i], dir, type);
    }
  }
}
