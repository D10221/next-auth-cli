#!/usr/bin/env node
import fs from "fs";
import path from "path";
import dotnev from "dotenv";
import yargs from "yargs";
import Debug from "debug";
import nextAuthCli from "next-auth-cli";

const debug = Debug("next-auth-cli");
const { usage, showHelp } = yargs;

var argv = usage(
  "Usage:\n $0 [-u <$DATABASE_URL>] [-q] [-c] [-m=</models.js>]"
).options({
  url: {
    description:
      "Driver dependent database url, overrides $DATABASE_URL\n" +
      "Typically:\n<driver>://[<u>:<p>]@<server>[:port]/<dbName>[?<opt>=<val>[&<opt>=<val>]]\n" +
      "Required when $DATABASE_URL not present\n" +
      "Wellknown valid options are: \n" +
      "- ?namingStrategy=<supported-next-auth-naming-strategy>\n" +
      "- ?entityPrefix=<string>\n" +
      "- ?synchronize=<true|false>",
    // required: !process.env.DATABASE_URL,
    alias: "u",
    string: true,
  },
  quiet: {
    description: "Be quiet",
    boolean: true,
    alias: "q",
  },
  ci: {
    description: "same as --quiet, overrides $CI",
    boolean: true,
    alias: "c",
  },
  models: {
    description:
      "../path/to/my/models.js\n" +
      "- As default export\n" +
      "- Absolute or relative to cwd.\n" +
      "- Defaults to next-auth Models",
    type: "string",
    alias: "m",
    // normalize: true,
  },
  env: {
    description: '../path/to/.env-file\ndefaults to "$cwd/.env(.local)?',
  },
}).argv;
/** run */
(async ({ url, quiet, models, help, env: envPath, ci, ...etc }) => {
  // ...
  try {
    const cwd = process.cwd();
    dotnev.config({
      path:
        envPath || fs.existsSync(path.join(cwd, ".env.local"))
          ? path.join(cwd, ".env.local") //allow shadow '.env'
          : path.join(cwd, ".env"),
    });
    quiet = quiet || Boolean(ci) || Boolean(process.env.CI); // common env flags compat
    if (!quiet) debug.enabled = true;
    url = url || process.env.DATABASE_URL;
    if (!url) {
      if (quiet) throw new Error("Missing or empty database url");
      console.error("Missing or empty database url");
      return showHelp();
    }
    new URL(url).searchParams
    await nextAuthCli(url, models);
    debug("migration: done");
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
})(argv)
  .then(() => {
    process.exit();
  })
  .catch(() => {
    process.exit(-1);
  });
