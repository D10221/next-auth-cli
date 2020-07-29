#!/usr/bin/env node
const { existsSync } = require("fs");
const { join } = require("path");
const args = require("minimist");
const env = require("dotenv");
// ... setup ...
let { databaseUrl, quiet, models, help, env: envPath, ci } = args(
  process.argv.slice(2)
);
env.config({
  path:
    envPath || existsSync(join(__dirname, ".env.local"))
      ? join(__dirname, ".env.local") //allow shadow '.env'
      : join(__dirname, ".env"),
});
quiet = quiet || Boolean(ci) || Boolean(process.env.CI); // common env flags compat
databaseUrl = databaseUrl || process.env.DATABASE_URL;
const log = (!quiet && console.log.bind(console)) || (() => {});
/** run */
(async () => {
  try {
    if (help) {
      return showHelp();
    }
    if (!databaseUrl) {
      if (quiet) throw new Error("Can't find database url");
      return showHelp(
        "\nExpected:\n%s",
        "$DATABASE_URL|--databaseUrl (Required)"
      );
    }
    await require("esm")(module)("next-auth-migrations").default(databaseUrl, models, log);
    // await require("next-auth-migrations").default(databaseUrl, models, log);
    log("migration: done");
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
})()
  .then(() => {
    process.exit();
  })
  .catch(() => {
    process.exit(-1);
  });
/**
 * @param {any[]} args
 */
function showHelp(...args) {
  log(
    [
      "Usage:",
      `  --databaseUrl=<driver>://<user>:<password>@<server>[:port]/<databasename> # overrides $DATABASE_URL`,
      `  Env:`,
      `     $DATABASE_URL # overrided by '--databaseUrl'`,
      `     $CI # boolean, same as '--quiet' (optional)`,
      `  Options:`,
      `    --models=../path/to/my/models.js # default export (optional)`,
      `    --quiet (No log) (optional)`,
      `    --ci (same as '--quiet') (optional)`,
      `    --env="path/to/.env-file" #default to ".env(.local)?" (optional)`,
      typeof args === "string" && args,
      typeof args[0] === "string" && args[0],
    ]
      .filter(Boolean)
      .join("\n"),
    ...((typeof args[0] === "string" && args.slice(1)) || args || [])
  );
}
