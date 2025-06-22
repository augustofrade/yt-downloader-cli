import chalk from "chalk";
import fs from "fs";
import path from "path";

import { formatBytes } from "../../functions/format-bytes";
import { Settings, VideoInfo } from "../../types/interface";
import { Result } from "../../types/result";
import { ConfigurationsOptionKeys } from "./types/configuration-option-keys.enum";
import { ConfigurationOptions } from "./types/configuration-options.interface";
import verifyConfigFileSchema from "./verify-config-file-schema";

export default class ConfigurationManager {
  private static readonly homePath = "../../../data";

  private static readonly configFilePath = path.join(
    __dirname,
    this.homePath,
    "configs.json"
  );
  private static readonly logFilePath = path.join(__dirname, this.homePath, "logs.txt");
  private static settings: Settings = ConfigurationManager.readConfigurationFile();

  public static get Settings(): Settings {
    return this.settings;
  }

  public static get downloadDirectory() {
    return ConfigurationManager.Settings.downloadDirectory;
  }

  public static get shouldGenerateLogs() {
    return ConfigurationManager.Settings.generateLogs;
  }

  public static setOptions(options: Partial<ConfigurationOptions>): Result<boolean> {
    const config = this.Settings;

    for (const [key, newValue] of Object.entries(options)) {
      if (newValue == undefined) continue;

      const configKey: ConfigurationsOptionKeys =
        ConfigurationsOptionKeys[key as keyof typeof ConfigurationsOptionKeys];
      (config as unknown as Record<string, string | boolean>)[configKey] = newValue;
    }

    try {
      fs.writeFileSync(this.configFilePath, JSON.stringify(config));
      return Result.Success(true);
    } catch (e) {
      return Result.Failure((e as Error).message);
    }
  }

  public static generateLog(videoInfo: VideoInfo): void {
    const { title, channelName, bytes } = videoInfo;
    const msg = `${new Date().toString()}\n${title}" by ${channelName}\nDownloaded ${formatBytes(bytes)}\n\n`;
    fs.appendFileSync(this.logFilePath, msg);
  }

  private static readConfigurationFile(): Settings {
    ConfigurationManager.handleHomeFolder();

    if (!this.verifyConfigFileIntegrity()) {
      this.showWarning(
        "Settings file not found or has an invalid schema. Creating new configuration file with default schema...\n"
      );
      fs.writeFileSync(this.configFilePath, JSON.stringify(this.defaultConfiguration));
    }

    const settings: Settings = JSON.parse(
      fs.readFileSync(this.configFilePath, { encoding: "utf-8" })
    );

    if (!fs.existsSync(settings.downloadDirectory)) {
      this.showWarning("Download directory not found. Creating the necessary paths...\n");
      fs.mkdirSync(settings.downloadDirectory, { recursive: true });
    }
    return settings;
  }

  private static handleHomeFolder(): void {
    const homePath = path.join(__dirname, this.homePath);
    if (!fs.existsSync(homePath)) {
      this.showWarning(`Creating data folder on default location: ${homePath}...\n`);
      fs.mkdirSync(homePath, { recursive: true });
    }
  }

  private static verifyConfigFileIntegrity(): boolean {
    return (
      fs.existsSync(this.configFilePath) && verifyConfigFileSchema(this.configFilePath)
    );
  }

  public static get defaultConfiguration() {
    return {
      downloadDirectory: path.join(__dirname, this.homePath, "downloads"),
      generateLogs: true,
      defaultFileFormat: "mp3",
    };
  }

  public static showError(msg: string): void {
    console.log(chalk.bgRed(msg));
  }

  public static showWarning(msg: string): void {
    console.log(chalk.yellow.bold(msg));
  }

  public static showSuccess(msg: string): void {
    console.log(chalk.green(msg));
  }
}
