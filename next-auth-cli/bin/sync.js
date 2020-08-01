import nextAuthCli from "next-auth-cli";
import Debug from "debug";
export const debug = Debug("next-auth-cli/sync");
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
      });
  },
  handler: async ({
    url,
    quiet = Boolean(process.env.CI),
    models,
    help,
    ...etc
  }) => {
    try {
      if (!quiet) debug.enabled = true;
      if (!url) {
        if (quiet) throw new Error("Missing or empty database url");
        console.error("Missing or empty database url");
        return (await import("yargs")).showHelp();
      }
      new URL(url).searchParams;
      await nextAuthCli.sync(url, models);
      debug("migration: done");
      process.exit();
    } catch (error) {
      console.error(error);
      process.exit(-1);
    }
  },
};
