import nextAuthCli from "next-auth-cli";
import Debug from "next-auth-cli/cli/debug.js";
export const debug = Debug(
  import.meta
);
const name = "create-tables";
/** run */
export default {
  name,
  describe: '"synchronize database models"',
  /** @param {import("yargs").Argv} yargs */
  builder: (yargs) => {
    yargs
      .usage("sync [-u <$NEXTAUTH_DB_URL>] [-q] [-c] [-m=</models.js>]")
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
        dropTables: {
          alias: "D",
          description: "Drop schema (tables, indices, fkeys)",
          type: "boolean",
        },
        createForeignKeys: {
          description: "Create Foreign Keys (false)",
          type: "boolean",
        },
        createIndices: {
          description: "Create Indices (if indices)",
          type: "boolean",
        },
        transaction: {
          description: "Create transaction (true)",
          type: "boolean",
        },
      });
  },
  handler: async ({
    dbUrl,
    quiet = Boolean(process.env.CI),
    models,
    help,
    dropTables,
    createForeignKeys,
    createIndices,
    transaction,
    ...etc
  }) => {
    try {
      // if(Object.keys(etc).length){throw new Error(`Unknown option: ${Object.keys(etc).join()}`)}
      if (!quiet) debug.enabled = true;
      if (!dbUrl) {
        if (quiet) throw new Error("Missing or empty database dbUrl");
        console.error("Missing or empty database dbUrl");
        return (await import("yargs")).showHelp();
      }
      await nextAuthCli.createTables(dbUrl, {
        models,
        dropTables,
        quiet,
        createForeignKeys,
        createIndices,
        transaction,
      });
      debug("done");
      process.exit();
    } catch (error) {
      console.error(error);
      process.exit(-1);
    }
  },
};
