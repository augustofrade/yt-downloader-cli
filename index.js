#!/usr/bin/env node

const yargs = require("yargs/yargs")
const { hideBin } = require("yargs/helpers")
const fs = require("fs");

const YtDownloader = require("./YTDownloader");
const { SettingsManager } = require("./SettingsManager");

const argv = yargs(hideBin(process.argv))
  .scriptName("yt-downloader")
  .usage("$0 <cmd> [url]")

  .command("download [url]", "Download video as mp3 from passed url", (yargs) => {
    let argv = yargs
      .usage("$0 download [args]")
      .positional("url", {
        type: "array",
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
      })

    }, function (argv) {
      let saveDir = SettingsManager.downloadDirectory;
      if(argv.dir && fs.existsSync(argv.dir)) {
        saveDir = argv.dir;
      } else if(argv.dir && !fs.existsSync(argv.dir)) {
        SettingsManager._showError(`"${argv.dir}" is not a valid directory`)
      }

      YtDownloader.shouldGenerateLogs = SettingsManager.shouldGenerateLogs;
      if(YtDownloader.shouldGenerateLogs)
        console.log("Generating logs for downloaded files\n");

      if(argv.queue) {
        YtDownloader.downloadQueue(argv.queue, saveDir);
      } else
        YtDownloader.downloadAudio(argv.url, saveDir)
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
        .usage("$0 settings show")
      }, function (yargs) {
        SettingsManager.printSettings();
      });

    }, function (argv) {
      const saved = SettingsManager.setSettings([ ["dir", argv.dir], ["generateLogs", argv.log] ]);
      if(saved)
        SettingsManager._showSuccess("Settings saved");
      else
        SettingsManager._showWarning("No settings changed");
    }
  )

  .version(false)
  .help()
  .argv