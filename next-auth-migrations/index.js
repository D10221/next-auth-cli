// ... env ...
import dotenv from "dotenv";
import { join, dirname } from "path";
import { existsSync } from "fs";
import minimist from "minimist";
import importModels from "./import-models";
import help from "./help";

global.__dirname =
  typeof __dirname !== "undefined" ? __dirname : dirname(import.meta.url);

dotenv.config({
  path: existsSync(join(__dirname, ".env.local")) //allow shadow .env
    ? existsSync(join(__dirname, ".env.local"))
    : existsSync(join(__dirname, ".env")),
});
/** run */
(async (args) => {
  const databaseUrl = args.databaseUrl || process.env.DATABASE_URL;
  if (args.help) return help();
  if (!databaseUrl) {
    return help("\nExpected:\n%s", "$DATABASE_URL|--databaseUrl (Required)");
  }
  // late import to allows re/define env.vars if needed
  const { default: withModels } = await import("./with-models");
  const { default: createTables } = await import("./create-tables");
  const { default: withTables } = await import("./with-tables");
  // ...
  const customModels = args.models && (await importModels(args.models));
  try {
    // prepare models
    const stage1 = withModels(databaseUrl, customModels);
    // make 'Tables'
    const stage2 = withTables(stage1);
    // run'em
    for await (const progress of createTables(stage2)) {
      console.log("%s: done", progress);
    }
    console.log("migration: done");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(-1);
  }
})(minimist(process.argv.slice(2)));