import chalk from "chalk";
import asyncConsole from "./async-console.js";
import countDown from "./count-down.js";
/**
 *
 * @param {(args: [import("./types").ConnectionOptions, import("./types").Models ])=> any} next
 */
export default function delayDropSchema(next) {
  return (
    /**
     * @param {[import("./types").ConnectionOptions, import("./types").Models ]} args
     */
    async function ([config, models]) {
      const droppingKeys = Object.keys(config).filter((key) =>
        /^drop\w+$/.test(key)
      );
      if (droppingKeys.length && !config.quiet) {
        // TODO: Move this Up on the chain, apply only to cli usage
        const { writeInLine, write } = asyncConsole();
        for await (const count of countDown(5, 1000)) {
          await writeInLine(
            `${chalk.redBright(
              `Last chance before ${droppingKeys.join()}`
            )} in ${count}s ${chalk.greenBright(
              "(Ctrl+c to cancel)"
            )} ${chalk.grey("[use '--quiet' to silence this]")}`
          );
        }
        await write("\n");
      }
      return next([config, models]);
    }
  );
}
