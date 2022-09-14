const path = require("path");
const fs = require("fs");
const chalk = require("chalk");


class SettingsManager {
    static configDir = path.join(__dirname, "./configs.json");
    static defaultSettings = {
        dir: path.join(__dirname, "./downloads")
    };

    static get Settings() {
        this._verifySettingsFile();
        return JSON.parse(fs.readFileSync(this.configDir));
    }
    
    static get downloadDirectory() {
        return this.Settings.dir;
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
        fs.writeFileSync(this.configDir, JSON.stringify( settings ));
       return saved;
    }

    static _verifySettingsFile() {
        if(!fs.existsSync(this.configDir) || fs.readFileSync(this.configDir).length === 0) {
            this._showWarning("Warning: no directory settings found. Creating new configuration file...\n");
            fs.writeFileSync(this.configDir, JSON.stringify( this.defaultSettings ));
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