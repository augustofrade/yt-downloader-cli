#!/usr/bin/env node

const chalk = require("chalk");
const yargs = require("yargs/yargs")
const { hideBin } = require("yargs/helpers")
const fs = require("fs");
const path = require("path");

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
      if(argv.queue)
        YtDownloader.downloadQueue(argv.bulk, saveDir);
      else
        YtDownloader.downloadVideo(argv.url, saveDir)
    }
  )

  .command("settings", "Define settings values passed from the options", (yargs) => {
    let argv = yargs
      .usage("$0 settings [option] [value]")
      .options({
        dir: {
          alias: "d",
          type: "string",
          description: "Sets the default directory the downloaded files will be saved on"
        }
      })
    }, function (argv) {
      const saved = SettingsManager.setSettings([ ["dir", argv.dir] ]);
      if(saved)
        SettingsManager._showSuccess("Settings saved");
      else
        SettingsManager._showWarning("No settings changed");
    }
  )

  .version(false)
  .help()
  .argv