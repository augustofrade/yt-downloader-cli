import ConfigurationManager from "../core/configuration/ConfigurationManager";

export function printConfigurations() {
  console.table(ConfigurationManager.Settings);
}
