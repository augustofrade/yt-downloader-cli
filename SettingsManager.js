const path = require("path");
const fs = require("fs");
const chalk = require("chalk");
const { formatBytes } = require("./utils");


class SettingsManager {
    static configFileDir = path.join(__dirname, "./configs.json");
    static logFileDir = path.join(__dirname, "./logs.txt");
    static defaultSettings = {
        dir: path.join(__dirname, "./downloads"),
        generateLogs: true,
    };

    static get Settings() {
        this._verifySettingsFile();
        return JSON.parse(fs.readFileSync(this.configFileDir));
    }
    
    static get downloadDirectory() {
        return this.Settings.dir;
    }

    static get shouldGenerateLogs() {
        return this.Settings.generateLogs;
    }

    static generateLog(videoInfo) {
        const { title, channelName, bytes } = videoInfo;
        const msg = `${new Date().toString()}\n${title}" by ${channelName}\nDownloaded ${formatBytes(bytes)}\n\n`;
        fs.appendFileSync(this.logFileDir, msg);
    }

    static setSettings(props) {
        const settings = this.Settings;
        let saved = false;
        props.forEach(([ key, value ]) => {
            if(value !== undefined) {
                settings[key] = value;
                saved = true;
            }
        });
        fs.writeFileSync(this.configFileDir, JSON.stringify( settings ));
       return saved;
    }

    static printSettings() {
        console.table(this.Settings);
    }

    static _verifySettingsFile() {
        if(!fs.existsSync(this.configFileDir) || fs.readFileSync(this.configFileDir).length === 0) {
            this._showWarning("Warning: no directory settings found. Creating new configuration file...\n");
            fs.writeFileSync(this.configFileDir, JSON.stringify( this.defaultSettings ));
        }
    }

    static _showError(msg) {
        console.log(chalk.bgRed(msg));
    }

    static _showWarning(msg) {
        console.log(chalk.bgYellow.black(msg));
    }

    static _showSuccess(msg) {
        console.log(chalk.green(msg));
    }
}


module.exports = { SettingsManager };