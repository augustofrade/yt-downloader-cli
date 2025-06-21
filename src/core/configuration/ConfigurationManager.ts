import chalk from "chalk";
import fs from "fs";
import path from "path";

import { formatBytes } from "../../functions/format-bytes";
import { SettingsEnum } from "../../types/enum";
import { Settings, SettingsCLI, VideoInfo } from "../../types/interface";
import verifyConfigFileSchema from "./verify-config-file-schema";

export default class ConfigurationManager {
  private static readonly configFilePath = path.join(__dirname, "../../../configs.json");
  private static readonly logFilePath = path.join(__dirname, "../../../logs.txt");
  private static settings: Settings = ConfigurationManager.verifySettingsFile();

  public static get Settings(): Settings {
    console.log(__dirname);
    return this.settings;
  }

  public static get downloadDirectory() {
    return ConfigurationManager.Settings.downloadDirectory;
  }

  public static get shouldGenerateLogs() {
    return ConfigurationManager.Settings.generateLogs;
  }

  public static setSettings(props: SettingsCLI): boolean {
    const settings = this.Settings;
    for (const [key, newValue] of Object.entries(props)) {
      if (newValue != undefined) {
        const settingsKey = SettingsEnum[key as keyof typeof SettingsEnum];
        (settings as unknown as Record<string, string>)[settingsKey] = newValue;
      }
    }
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

  private static verifySettingsFile(): Settings {
    if (
      !fs.existsSync(this.configFilePath) ||
      !verifyConfigFileSchema(this.configFilePath)
    ) {
      this.showWarning(
        "Warning: settings file not found or has an invalid schema. Creating new configuration file...\n"
      );
      fs.writeFileSync(
        this.configFilePath,
        JSON.stringify({
          downloadDirectory: path.join(__dirname, "../downloads"),
          generateLogs: true,
          defaultFileFormat: "mp3",
        })
      );
    }
    const settings: Settings = JSON.parse(
      fs.readFileSync(this.configFilePath, { encoding: "utf-8" })
    );
    if (!fs.existsSync(settings.downloadDirectory)) {
      this.showWarning(
        "Warning: download directory not found. Creating the neccessary paths...\n"
      );
      fs.mkdirSync(settings.downloadDirectory, { recursive: true });
    }
    return settings;
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
