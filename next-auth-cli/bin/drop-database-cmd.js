import nextAuthCli from "next-auth-cli";
import Debug from "next-auth-cli/cli/debug.js";
export const debug = Debug(
  import.meta.url || (typeof module !== "undefined" && module.filename) || ""
);
const name = "drop-database";
/** run */
export default {
  name,
  describe: '"Drop database"',
  /** @param {import("yargs").Argv} yargs */
  builder: (yargs) => {
    yargs
      .usage(
        "drop-database [-u <$NEXTAUTH_DB_URL>] [-q] [-c] [-m=</models.js>]"
      )
      .options({
        dbUrl: {
          description:
            "Driver dependent database Url\n" +
            "Typically:\n<driver>://[<u>:<p>]@<server>[:port]/<dbName>[?<opt>=<val>[&<opt>=<val>]]\n" +
            "Wellknown valid options are: \n" +
            "- ?namingStrategy=<supported-next-auth-naming-strategy>\n" +
            "- ?entityPrefix=<string>\n",
          alias: "u",
          string: true,
          required: true,
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
          coerce: (ci, args) => {
            return {
              ...args,
              quiet: Boolean(ci),
            };
          },
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
        createDatabase: {
          description: "create database after drop",
          type: "boolean",
        },
      });
  },
  handler: async ({
    dbUrl,
    quiet = Boolean(process.env.CI),
    models,
    createDatabase,
  }) => {
    try {
      if (!quiet) debug.enabled = true;
      await nextAuthCli.dropDatabase(dbUrl, {
        models,
        quiet,
        createDatabase,
        dropDatabase: true
      });
      debug("done");
      process.exit();
    } catch (error) {
      console.error(error);
      process.exit(-1);
    }
  },
};
