import { ArgumentsCamelCase } from "yargs";
import ConfigurationManager from "../core/configuration/ConfigurationManager";
import { ConfigurationOptions } from "../core/configuration/types/configuration-options.interface";

export function handleSetConfigurationFileCommand(
  argv: ArgumentsCamelCase<ConfigurationOptions>
) {
  const result = ConfigurationManager.setOptions({
    dir: argv.dir,
    logs: argv.logs,
    format: argv.format,
  });
  if (result.isSuccess()) {
    ConfigurationManager.showSuccess("Settings saved");
  } else {
    ConfigurationManager.showWarning(result.error!);
  }
}
