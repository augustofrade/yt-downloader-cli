import { ArgumentsCamelCase } from "yargs";
import ConfigurationManager from "../core/configuration/ConfigurationManager";
import { ConfigurationOptions } from "../core/configuration/types/configuration-options.interface";
import getDownloadTypeInfo from "../core/downloader/helpers/get-download-type-info";
import ConsoleLogger from "../helpers/ConsoleLogger";

export function handleSetConfigurationFileCommand(
  argv: ArgumentsCamelCase<ConfigurationOptions>
) {
  if (getDownloadTypeInfo(argv.type) == undefined) {
    ConsoleLogger.showError(
      `Invalid value for 'type' configuration. Expected (audio|video) but received "${argv.type}"`
    );
    return;
  }

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
