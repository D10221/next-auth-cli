#!/usr/bin/env node
import dotnev from "dotenv";
import fs from "fs";
import Debug from "next-auth-cli/cli/debug.js";
import path from "path";
import yargs from "yargs";
import module from "module";
const debug = Debug("bin");
const cwd = process.cwd();
debug("cwd: ", cwd);
// load cwd .env|.env.local ?
debug(
  "env-file: ",
  dotnev.config({
    path: fs.existsSync(path.join(cwd, ".env.local"))
      ? path.join(cwd, ".env.local") //allow shadow '.env'
      : path.join(cwd, ".env"),
  }).parsed
);
/** resolve location */
const cmdBase = path.join(
  path.dirname(module.createRequire(import.meta.url).resolve("next-auth-cli")),
  "cmds"
);

/**
 * @param {string} cmdBase where the commands are ...
 */
function importCmds(cmdBase) {
  return Promise.all(
    fs
      .readdirSync(cmdBase)
      .filter((x) => /\.js$/i.test(x))
      .map(async (moduleName) => {
        try {
          const _module = await import(
            "file://" + path.posix.join(cmdBase, moduleName)
          );
          return _module.default || _module;
        } catch (error) {
          return Promise.reject(error);
        }
      })
  );
}
/** run */
(async () => {
  try {
    const y = yargs
      .scriptName("next-auth-cli")
      .usage("Usage:\n $0 <cmd> [args]")
      .env("NEXTAUTH_")
      .demandCommand(1)
      .strict();
    // yargs can't load commadDir , because it can't require 'modules'
    for (const cmd of await importCmds(cmdBase)) {
      debug("command: %s", cmd.command);
      y.command(cmd);
    }
    return debug(y.argv);
  } catch (error) {
    return Promise.reject(error);
  }
})().catch((error) => {
  console.error(error);
  process.exit(-1);
});
