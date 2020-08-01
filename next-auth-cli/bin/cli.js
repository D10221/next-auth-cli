#!/usr/bin/env node
import yargs from "yargs";
import sync from "./sync.js";
import fs from "fs";
import path from "path";
import dotnev from "dotenv";
import Debug from "debug";
const debug = Debug("next-auth-cli");
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
