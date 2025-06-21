import { ArgumentsCamelCase } from "yargs";
import ConfigurationManager from "../core/configuration/ConfigurationManager";
import { SettingsCLI } from "../types/interface";

export function handleSetConfigurationFileCommand(argv: ArgumentsCamelCase<SettingsCLI>) {
  const saved = ConfigurationManager.setSettings({
    dir: argv.dir,
    logs: argv.logs,
    format: argv.format,
  });
  if (saved) ConfigurationManager.showSuccess("Settings saved");
  else ConfigurationManager.showWarning("No settings changed");
}
