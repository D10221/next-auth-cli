import nextAuthCli from "next-auth-cli";
import Debug from "next-auth-cli/cli/debug.js";
export const debug = Debug(import.meta.url);
/** run */
export default {
  name: "sync",
  describe: '"synchronize database models"',
  /** @param {import("yargs").Argv} yargs */
  builder: (yargs) => {
    yargs
      .usage("sync [-u <$NEXTAUTH_URL>] [-q] [-c] [-m=</models.js>]")
      .env("NEXTAUTH_")
      .options({
        url: {
          description:
            "Driver dependent database url\n" +
            "Typically:\n<driver>://[<u>:<p>]@<server>[:port]/<dbName>[?<opt>=<val>[&<opt>=<val>]]\n" +
            "Wellknown valid options are: \n" +
            "- ?namingStrategy=<supported-next-auth-naming-strategy>\n" +
            "- ?entityPrefix=<string>\n" +
            "- ?synchronize=<true|false>",
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
          choices: [true, false, "yes", "no", "y", "n"],
          // coerce: (dropSchema, args) => {
          //   if (dropSchema) {
          //     let url = new URL(args.url);
          //     url.searchParams.dropSchema =
          //       dropSchema === true || /^(y|yes|true)$/i.test(dropSchema || "");
          //     return url.toString();
          //   }
          //   return args;
          // },
        },
      });
  },
  handler: async ({
    url,
    quiet = Boolean(process.env.CI),
    models,
    help,
    dropSchema,
    ...etc
  }) => {
    try {
      if (!quiet) debug.enabled = true;
      if (!url) {
        if (quiet) throw new Error("Missing or empty database url");
        console.error("Missing or empty database url");
        return (await import("yargs")).showHelp();
      }
      await nextAuthCli.sync(url, { models, dropSchema, quiet });
      debug("Sync: done");
      process.exit();
    } catch (error) {
      console.error(error);
      process.exit(-1);
    }
  },
};