import util from "util";
/**
 *
 */
export default function asyncConsole() {
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
