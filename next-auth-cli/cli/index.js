import { Models, transform, loadConfig } from "./internal.js";
import setup from "./setup.js";
import sync from "./sync.js";
/**
 * @param {import("./types").ConnectionOptions|string} config
 * @param {import("./types").Models|string} [models]
 * @returns {Promise<void>}
 */
export default function Cli(config, models = Models) {
  return setup(config, models).then(loadConfig).then(transform).then(sync);
}
