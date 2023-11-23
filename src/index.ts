#!/usr/bin/env node

/* eslint-disable no-unused-vars */
import SettingsManager from "./SettingsManager";
import YTDownloader from "./YTDownloader";
import yargs, { ArgumentsCamelCase, Argv } from "yargs";
import { hideBin } from "yargs/helpers";
import fs from "fs";
import { DownloadFlags, DownloadOptions, SettingsCLI } from "./types/interface";

const argv = yargs(hideBin(process.argv))
  .scriptName("yt-downloader")
  .usage("$0 <cmd> [url]")

  .command("download [url]", "Download video as mp3 from passed url", (yargs) => {
    let argv = yargs
      .usage("$0 download [args]")
      .positional("url", {
        type: "string",
        describe: "the url to download the music from",
      })
      .options({
        dir: {
          alias: "d",
          type: "string",
          description: "Defines the directory the files on the queue will be saved on"
        },
        queue: {
          alias: "q",
          type: "array",
          description: "Downloads a list of videos separated by spaces"
        }
      });
      return argv as any;

    }, function (argv: ArgumentsCamelCase<DownloadFlags>) {
  
      // Main function
      let saveDir = SettingsManager.downloadDirectory;
      if(argv.dir && fs.existsSync(argv.dir)) {
        saveDir = argv.dir;
      } else if(argv.dir && !fs.existsSync(argv.dir)) {
        SettingsManager.showError(`"${argv.dir}" is not a valid directory`);
      }

      YTDownloader.shouldGenerateLogs = SettingsManager.shouldGenerateLogs;
      if(YTDownloader.shouldGenerateLogs)
        console.log("*Generating logs for downloaded files\n");

      // Download 
      if(argv.queue) {
        YTDownloader.downloadQueue(argv.queue, saveDir);
      } else
        YTDownloader.downloadVideo(argv.url, saveDir);
    }
  )

  .command("settings", "Define settings values passed from the options", (yargs) => {
    let argv = yargs
      .usage("$0 settings [option]=[value]")
      .options({
        dir: {
          alias: "d",
          type: "string",
          description: "Sets the default directory the downloaded files will be saved on"
        }
      })
      .options({
        log: {
          alias: "l",
          type: "boolean",
          description: "Sets whether to log the downloaded files to the log file or not"
        }
      })

      .command("show", "Exibes all settings and its values", (yargs) => {
        let argv = yargs
        .usage("$0 settings show");
      }, function (yargs) {
        SettingsManager.printSettings();
      });

    }, function (argv: ArgumentsCamelCase<SettingsCLI>) {
      const saved = SettingsManager.setSettings({
        "dir": argv.dir,
        "logs": argv.logs,
        "format": argv.format
      });
      if(saved)
        SettingsManager.showSuccess("Settings saved");
      else
        SettingsManager.showWarning("No settings changed");
    }
  )

  .version(false)
  .help()
  .argv;