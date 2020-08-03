import nextAuthCli from "next-auth-cli";
import Debug from "next-auth-cli/cli/debug.js";
export const debug = Debug(
  import.meta
);
const name = "sync";
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
        dropSchema: {
          alias: "D",
          description: "Drop schema",
          type: "boolean",
        },
      });
  },
  handler: async ({
    dbUrl,
    quiet = Boolean(process.env.CI),
    models,
    dropSchema,
  }) => {
    try {
      if (!quiet) debug.enabled = true;
      await nextAuthCli.sync(dbUrl, { models, dropSchema, quiet });
      debug("done");
      process.exit();
    } catch (error) {
      console.error(error);
      process.exit(-1);
    }
  },
};
