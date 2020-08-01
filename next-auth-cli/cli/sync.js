import typeorm from "typeorm";
import Debug from "./debug.js";
import util from "util";
import chalk from "chalk";
export const debug = Debug(import.meta.url);
/**
 * @param {[import("./types").ConnectionOptions, import("./types").Models ]} args
 * @returns {Promise<void>}
 */
export default async function sync([config, models]) {
  let connection;
  try {
    if (config.dropSchema && !config.quiet) {
      const { writeInLine, write } = asyncConsole();
      for await (const count of countDown(5, 1000)) {
        await writeInLine(
          `${chalk.redBright(
            "Dropping schema"
          )} in ${count}s ${chalk.greenBright(
            "(Ctrl+c to cancel)"
          )} ${chalk.grey("[use '--quiet' to silence this]")}`
        );
      }
      await write("\n");
    }
    debug(
      "connecting as %s to %s://%s:%s/%s",
      config.name,
      config.type,
      config.host,
      config.port,
      config.database
    );
    connection = await typeorm.createConnection(config);
    await connection.synchronize(
      // "&dropSchema=true|yes|YES?"
      config.dropSchema
    );
    debug("synchronized.");
  } catch (error) {
    return Promise.reject(error);
  } finally {
    if (connection && connection.isConnected) {
      connection.close();
    }
  }
}
/**
 * @param {number} to
 * @param {number} wait
 */
async function* countDown(to, wait) {
  for (let i = 0; i < to; i++) {
    await new Promise((resolve) => setTimeout(resolve, wait));
    yield to - i;
  }
}
/**
 *
 */
function asyncConsole() {
  const write = util.promisify(process.stdout.write.bind(process.stdout));
  const clearLine = util.promisify(
    process.stdout.clearLine.bind(process.stdout)
  );
  const cursorTo = util.promisify(process.stdout.cursorTo.bind(process.stdout));
  return {
    write,
    clearLine,
    cursorTo,
    /**
     * @param {string | Uint8Array} args
     */
    async writeInLine(args) {
      await cursorTo(0);
      await write(args);
      await clearLine(1);
    },
  };
}
