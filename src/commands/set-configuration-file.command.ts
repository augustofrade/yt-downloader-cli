import { ArgumentsCamelCase } from "yargs";
import ConfigurationManager from "../core/configuration/ConfigurationManager";
import { ConfigurationOptions } from "../core/configuration/types/configuration-options.interface";
import ConsoleLogger from "../helpers/ConsoleLogger";

export function handleSetConfigurationFileCommand(
  argv: ArgumentsCamelCase<ConfigurationOptions>
) {
  const result = ConfigurationManager.setOptions({
    dir: argv.dir,
    logs: argv.logs,
    type: argv.type,
  });
  if (result.isSuccess()) {
    ConsoleLogger.showSuccess("Settings saved");
  } else {
    ConsoleLogger.showWarning(result.error);
  }
}
