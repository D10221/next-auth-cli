#!/usr/bin/env node
import dotnev from "dotenv";
import fs from "fs";
import sync from "next-auth-cli/bin/sync-cmd.js";
import Debug from "next-auth-cli/cli/debug.js";
import path from "path";
import yargs from "yargs";
const debug = Debug(import.meta.url || (typeof  module !== "undefined" && module.filename) || "" );
const cwd = process.cwd();
debug("cwd: ", cwd);
debug(
  "env-file: ",
  dotnev.config({
    path: fs.existsSync(path.join(cwd, ".env.local"))
      ? path.join(cwd, ".env.local") //allow shadow '.env'
      : path.join(cwd, ".env"),
  }).parsed
);
debug(
  yargs
    .scriptName("next-auth-cli")
    .usage("Usage:\n $0 <cmd> [args]")
    .demandCommand(1)
    .command(sync.name, sync.describe, sync.builder, sync.handler).argv
);
