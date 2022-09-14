#!/usr/bin/env node

// const yargs = require("yargs");
const chalk = require("chalk");
const fs = require("fs");
const path = require("path");
const YtDownloader = require("./downloader");


class CLIPrototype {
    static downloadDir;
    static parse(argv) {
        const input = process.argv.slice(2);
        if(input[0] === undefined)
            return this._showError("A flag must be specified!!");
        const args = {
            flag: input[0],
            params: input.slice(1)
        }
        this.getDownloadDirectory();
        this.validate(args);
    }

    static validate(args) {
        const flag = args.flag;
        if(flag === "-c" || flag === "--config") {
            this.setSettings(args.params[0], args.params[1]);
        }
        else if((flag === "-d" || flag === "--download") && args.params.length === 1) {
            YtDownloader.downloadVideo(args.params[0], this.downloadDir);
        } else if((flag === "-b" || flag === "--bulk") && args.params.length > 0) {
            YtDownloader.downloadBulk(args.params, this.downloadDir);
        }
    }

    static setSettings(key, value) {
        if(key === undefined || value === undefined)
            return this._showError("Config key and value must be specified!!");
        else if(key === "--dir") {
            fs.writeFileSync("./configs.json", JSON.stringify({ dir: value }));
            console.log(`Download directory set to ${chalk.yellow(value)}`);
        }
        else {
            this._showWarning("Invalid flag passed.")
        }
    }

    static _showError(msg) {
        console.log(chalk.bgRed(msg));
    }

    static _showWarning(msg) {
        console.log(chalk.bgYellow.black(msg));
    }

    static getDownloadDirectory() {
        this._verifySettingsFile();
        this.downloadDir = JSON.parse(fs.readFileSync("./configs.json")).dir;
    }
    
    static _verifySettingsFile() {
        if(!fs.existsSync("./configs.json") || fs.readFileSync("./configs.json").length === 0) {
            this._showWarning("Warning: no directory settings found. Creating new configuration file...\n");
            fs.writeFileSync("./configs.json", JSON.stringify({ dir:  path.join(__dirname, "downloads") }));
        }
    }
}

CLIPrototype.parse(process.argv);