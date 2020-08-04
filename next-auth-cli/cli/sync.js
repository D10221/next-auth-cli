import Debug from "./debug.js";
import importModule from "./import-module.js";
import { Adapter, parse } from "./internal.js";

const debug = Debug(import.meta);
/**
 * Try sync with adapter
 * @returns {Promise<void>}
 * @param {import("./types").Configuration|string|undefined} config
 * @param {import("./types").ConnectionOptions|string} [database]
 * @param {import("./types").NextAuthAdapter|string} [adapter]
 * @param {*} [options]
 */
export default async function sync(
  config,
  database,
  adapter,
  { quiet, ...etc } // extract away cli options not used by Adapter
) {
  config && debug("config: ", config);
  adapter && debug("adapter: ", adapter);
  database && debug("database: ", database);
  try {
    /** @type {import("./types").Configuration} */
    const _config =
      typeof config === "string"
        ? await importModule(config)
        : config || { adapter: undefined, database: undefined };
    // override adapter if provided, or use config.Adapter or use DefaultAdapter  ...
    _config.adapter = await useAdapter(adapter || _config.adapter || Adapter);
    if (typeof _config.adapter !== "function") {
      throw new Error("Wrong adapter!");
    }
    if (_config.adapter === Adapter) {
      debug("using default Adapter");
    }
    // override database if provided  ...
    _config.database = await useDatabase(database || _config.database);
    if (!_config.database) {
      throw new Error("Can't find database!");
    }
    //
    // const { notThis, notThat, ...options } = etc; // be specific
    debug(_config);
    const _adapter = _config.adapter({
      ..._config.database,
      // ...options, // TODO: map more options ?
      synchronize: true, // force sync
    });
    // ...
    debug("synchronizing");
    const __adapter = await _adapter.getAdapter(/* appOptions */);
    // Just force sync
    await __adapter.getUser().catch(Debug);
  } catch (error) {
    debug(error);
    return Promise.reject(error);
  }
}
/**
 * parse or import object
 * @param {import("./types").ConnectionOptions|string|undefined} database
 * @returns {Promise<import("./types").ConnectionOptions|undefined>}
 */
async function useDatabase(database) {
  switch (typeof database) {
    case "string": {
      const url = new URL(database);
      if (/file/.test(url.protocol)) {
        return importModule(database);
      }
      return parse(database);
    }
    default:
      return database;
  }
}
/**
 * Maybe import adapter
 * @param {*} adapter
 */
function useAdapter(adapter) {
  if (typeof adapter === "string") {
    return importModule(adapter);
  }
  return adapter;
}
