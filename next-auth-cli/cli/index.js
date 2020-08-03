import Debug from "./debug.js";
import delayDrop from "./delay-drop.js";
import { loadConfig, Models, transform, Adapter } from "./internal.js";
import setup from "./setup.js";
import withOptions from "./with-options.js";
/** */
const debug = Debug("");
/**
 * Try sync with adapter
 * @param {import("./types").ConnectionOptions|string} config
 * @param {{ models?: import("./types").Models|string} & { [key: string]: any }} [options]
 * @returns {Promise<void>}
 */
const sync = (config, { models = Models, ...etc } = { models: Models }) =>
  setup(config, models)
    .then(loadConfig)
    .then(transform)
    .then(withOptions(etc)) // Merge extra options
    .then(
      delayDrop(async ([{ quiet, ...config }, models]) => {
        try {
          debug("synchronizing");
          config.synchronize = true;
          const adapter = await Adapter(config, {}).getAdapter();
          // Just force sync
          await adapter.getUser().catch(Debug);
        } catch (error) {
          return Promise.reject(error);
        }
      })
    );
/**
 *
 */
export default {
  name: "next-auth-cli",
  sync,
};
