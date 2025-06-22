#!/usr/bin/env node
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

import { handleVideoDownloadCommand } from "./commands/download-video.command";
import { printConfigurations } from "./commands/print-configurations";
import { handleSetConfigurationFileCommand } from "./commands/set-configuration-file.command";

/* eslint-disable no-unused-vars */
const argv = yargs(hideBin(process.argv))
  .scriptName("yt-downloader")
  .usage("$0 <cmd>")

  .command(
    "download [url]",
    "Download video as mp3 from passed url",
    (yargs) => {
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
            description: "Defines the directory the files on the queue will be saved on",
          },
          queue: {
            alias: "q",
            type: "array",
            description: "Downloads a list of videos separated by spaces",
          },
        });
      return argv as any;
    },
    handleVideoDownloadCommand
  )

  .command(
    "configs",
    "Define configuration values passed from the options",
    (yargs) => {
      let argv = yargs
        .usage("$0 configs [option]=[value]")
        .options({
          dir: {
            alias: "d",
            type: "string",
            description:
              "Sets the default directory the downloaded files will be saved on",
          },
        })
        .options({
          log: {
            alias: "l",
            type: "boolean",
            description:
              "Sets whether to log the downloaded files to the log file or not",
          },
        })

        .command(
          "show",
          "Shows all configuration and its values",
          (yargs) => {
            let argv = yargs.usage("$0 configs show");
          },
          printConfigurations
        );
    },
    handleSetConfigurationFileCommand
  )

  .version(false)
  .help().argv;
