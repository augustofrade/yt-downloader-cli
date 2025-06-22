import fs from "fs";
import { Validator } from "jsonschema";

import { configFileSchema } from "./config-file-schema";

export default function verifyConfigFileSchema(filePath: string): boolean {
  const v = new Validator();
  const settings = JSON.parse(fs.readFileSync(filePath, { encoding: "utf-8" }));
  return v.validate(settings, configFileSchema).valid;
}
