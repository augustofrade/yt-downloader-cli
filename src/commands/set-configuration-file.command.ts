import { ArgumentsCamelCase } from "yargs";
import SettingsManager from "../core/SettingsManager";
import { SettingsCLI } from "../types/interface";

export function handleSetConfigurationFileCommand(argv: ArgumentsCamelCase<SettingsCLI>) {
  const saved = SettingsManager.setSettings({
    dir: argv.dir,
    logs: argv.logs,
    format: argv.format,
  });
  if (saved) SettingsManager.showSuccess("Settings saved");
  else SettingsManager.showWarning("No settings changed");
}
