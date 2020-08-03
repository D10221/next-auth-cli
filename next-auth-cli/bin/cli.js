#!/usr/bin/env node
import dotnev from "dotenv";
import fs from "fs";
import sync from "next-auth-cli/bin/sync-cmd.js";
import createTables from "next-auth-cli/bin/create-tables-cmd.js";
import dropDatabase from "next-auth-cli/bin/drop-database-cmd.js";
import createDatabase from "next-auth-cli/bin/create-database-cmd.js";
import Debug from "next-auth-cli/cli/debug.js";
import path from "path";
import yargs from "yargs";
const debug = Debug(
  import.meta
);
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
    .env("NEXTAUTH_")
    .demandCommand(1)
    .command(sync.name, sync.describe, sync.builder, sync.handler)
    .command(
      createTables.name,
      createTables.describe,
      createTables.builder,
      createTables.handler
    )
    .command(
      dropDatabase.name,
      dropDatabase.describe,
      dropDatabase.builder,
      dropDatabase.handler
    )
    .command(
      createDatabase.name,
      createDatabase.describe,
      createDatabase.builder,
      createDatabase.handler
    )
    .strict().argv
);
