import { Models, transform, loadConfig } from "./internal.js";
import setup from "./setup.js";
import sync from "./sync.js";
export default {
  name: "next-auth-cli",
  /**
   * @param {import("./types").ConnectionOptions|string} config
   * @param {import("./types").Models|string} [models]
   * @returns {Promise<void>}
   */
  sync: (config, models = Models) =>
    setup(config, models).then(loadConfig).then(transform).then(sync),
};
