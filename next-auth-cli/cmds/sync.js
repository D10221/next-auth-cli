import { sync } from "next-auth-cli";
import Debug from "next-auth-cli/cli/debug.js";
export const debug = Debug("cmds:sync");
import chalk from "chalk";
const name = "sync";
/** run */
export default {
  name,
  command: name,
  describe: '"synchronize database models"',
  /** @param {import("yargs").Argv} yargs */
  builder: (yargs) => {
    yargs //
      .usage("$0 sync [config] [...options]") //
      .positional("config", {
        describe:
          "../path/to/my/configuration.js\n" +
          "Optional: if '--adapter' or '--database' provided.",
        type: "string",
      })
      .options({
        database: {
          description:
            "Driver dependent database URL\n" +
            "OR ../path/to/my/database-configuration.js\n" +
            "if protocol is 'file://'\n" +
            "- Overrides config.database",
          alias: "db",
          string: true,
        },
        adapter: {
          description:
            "../path/to/my/adapter.js\n" +
            "- Absolute or relative to cwd.\n" +
            "- Defaults to next-auth Default adapter" +
            "- Overrides config.adapter",
          type: "string",
          alias: "a",
          // normalize: true,
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
      });
  },
  handler: async ({
    adapter,
    database,
    // extra options
    quiet = Boolean(process.env.CI),
    _: postional,    
  }) => {
    try {
      const config = postional[1];
      debug({ config, database, adapter });
      if (!(config || adapter || database)) {
        // require at least 1 option
        (await import("yargs")).default.showHelp();
        return console.warn(
          chalk.yellowBright(
            "\nExpected <configuration> or <database> or [<database> + <adapter>]\n"
          )
        );
      }
      if (!config) {
        //TODO: use yarg conflicts?
        if (!database) {
          (await import("yargs")).default.showHelp();
          return console.warn(
            chalk.yellowBright(
              "\nExpected <configuration> or <database> or [<database> + <adapter>]\n"
            )
          );
        }
      }
      await sync(config, database, adapter, { quiet });
      debug("done");
      // it takes too long otherwise
      process.exit();
    } catch (error) {
      return Promise.reject(error);
    }
  },
};
