import path from "path";
import fs from "fs";
import chalk from "chalk";
import { formatBytes } from "./functions/format-bytes";
import { Settings, SettingsCLI, VideoInfo } from "./types/interface";

export default class SettingsManager {
    private static readonly configFilePath = path.join(__dirname, "./configs.json");
    private static readonly logFilePath = path.join(__dirname, "./logs.txt");

    public static get Settings(): Settings {
        this.verifySettingsFile();
        return JSON.parse(fs.readFileSync(this.configFilePath, { encoding: "utf-8" }));
    }

    public static get downloadDirectory() {
        return SettingsManager.Settings.saveDirectory;
    }

    public static get shouldGenerateLogs() {
        return SettingsManager.Settings.generateLogs;
    }

    public static setSettings(props: SettingsCLI): boolean {
        const settings = this.Settings;
        let saved = false;
        // TODO: create usage of a variable number of settings
        settings.defaultFileFormat = props.format;
        settings.generateLogs = props.logs;
        settings.saveDirectory = props.dir;
        try {
            fs.writeFileSync(this.configFilePath, JSON.stringify(settings));
            return true;
        } catch {
            return false;
        }
    }

    public static generateLog(videoInfo: VideoInfo): void {
        const { title, channelName, bytes } = videoInfo;
        const msg = `${new Date().toString()}\n${title}" by ${channelName}\nDownloaded ${formatBytes(bytes)}\n\n`;
        fs.appendFileSync(this.logFilePath, msg);
    }

    private static verifySettingsFile(): void {
        // TODO: create fool-proof directory verification
        if(!fs.existsSync(this.configFilePath) || fs.readFileSync(this.configFilePath).length === 0) {
            this.showWarning("Warning: no directory settings found. Creating new configuration file...\n");
            fs.writeFileSync(this.configFilePath, JSON.stringify({
                saveDirectory: path.join(__dirname, "./downloads"),
                generateLogs: true,
                defaultFileFormat: "mp3"
            }));
        }
    }

    public static showError(msg: string): void {
        console.log(chalk.bgRed(msg));
    }

    public static showWarning(msg: string): void {
        console.log(chalk.bgYellow.black(msg));
    }

    public static showSuccess(msg: string): void {
        console.log(chalk.green(msg));
    }

    public static printSettings() {
        console.table(this.Settings);
    }
}