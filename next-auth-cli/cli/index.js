import { Models, transform, loadConfig } from "./internal.js";
import setup from "./setup.js";
import sync from "./sync.js";
/** 
 * 
 */
export default {
  name: "next-auth-cli",
  /**
   * @param {import("./types").ConnectionOptions|string} config
   * @param {{ models?: import("./types").Models|string} & { [key: string]: any }} [options]
   * @returns {Promise<void>}
   */
  sync: (config, { models = Models, ...etc } = { models: Models }) =>
    setup(config, models)
      .then(loadConfig)
      .then(transform)
      .then(extra(etc)) // Merge extra options
      .then(sync),
};
/**
 * Merge extra options
 * @param {{ [key: string]: any }} etc
 * */
function extra(etc) {
  /**
   * @param {[import("./types").ConnectionOptions, import("./types").Models]} args
   * @returns {[import("./types").ConnectionOptions, import("./types").Models]}
   * */
  function merge([config, models]) {
    return [{ ...config, ...etc }, models];
  }
  return merge;
}
