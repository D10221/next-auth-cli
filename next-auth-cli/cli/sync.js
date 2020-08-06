import Debug from 'debug';
import importModule from './import-module.js';
import { Adapter, parse } from './internal.js';

const debug = Debug('next-auth-cli:sync');
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
  config && debug('config: ', config);
  adapter && debug('adapter: ', adapter);
  database && debug('database: ', database);
  try {
    /** 
     * @type {{
          adapter: import("./types").NextAuthAdapter,  
          database?: import("./types").ConnectionOptions
       }} */
    const _config =
      typeof config === 'string'
        ? await importModule(config)
        : config || { adapter: undefined, database: undefined };
    // override adapter if provided, ... or use config.Adapter, or use DefaultAdapter
    _config.adapter = await useAdapter(adapter || _config.adapter || Adapter);
    // override database if provided  ... or use config database
    _config.database = await useDatabase(database || _config.database);
    if (!_config.database) {
      throw new Error("Can't find database!");
    }
    // TODO: const { notThis, notThat, ...options } = etc; // be specific
    debug(_config);
    const _adapter = initializeAdapter(_config, { quiet });
    // ...
    debug('synchronizing');
    const __adapter = await _adapter({
      // WARNING:
      // custom adapter, should honor the synchronize flag
      // or accept options as initialization if provided separately
      // by the --adapter flag
      synchronize: true,
    });
    // Just force sync
    await __adapter.getUser(1);
  } catch (error) {
    debug(error);
    return Promise.reject(error);
  }
}
/** 
 * Maybe initialize adapter if its initializable, its default adapter,
 * @param {{
    adapter: import("./types").NextAuthAdapter | import("./types").CustomNextAuthAdapter,  
    database?: import("./types").ConnectionOptions
  }} config
* @param {*} [cliOptions]
*/
function initializeAdapter(config, cliOptions) {
  if (isCustomAdapter(config.adapter)) {
    debug('using custom Adapter');
    if (!cliOptions.quiet) {
      console.warn(
        "Can't initialize, initialized Adapter, it should accept { syncronize} on getAdapter, or provide external --adapter"
      );
    }
    // custom adapter, its probably part of the whole config
    // is Standard 'next-auth' configuration
    // it can't be initialized
    return config.adapter.getAdapter.bind(config.adapter);
  }
  if (isDefaultAdapter(config.adapter)) {
    // It is the default Adapter
    // probably only database exists in configuration
    // is Standard next-auth's config
    debug('using default Adapter');
    return config
      .adapter({
        ...config.database,
        // ...options, // TODO: map more options ?
        synchronize: true,
      })
      .getAdapter.bind(config.adapter);
  }
  // is external adapter
  if (typeof config.adapter === 'function') {
    debug('using unkown/external? Adapter');
    // last chance: if adapter was '--adapter'
    // it might not have been initialized, yet
    // WARN: this can't be part of 'Standard next-auth config'
    // @ts-ignore
    const maybeAdapter = config.adapter({
      ...config.database,
      synchronize: true,
    });
    if (isCustomAdapter(maybeAdapter)) {
      return maybeAdapter.getAdapter.bind(maybeAdapter);
    }
  }
  throw new Error(
    `I Don't know how to initialize this "${config.adapter}" adapter`
  );
}
/**
 * @param {*} adapter
 * @returns {adapter is import("./types").NextAuthAdapter}
 */
function isDefaultAdapter(adapter) {
  return adapter === Adapter;
}
/**
 * @param {*} adapter
 * @returns {adapter is import("./types").CustomNextAuthAdapter}
 */
function isCustomAdapter(adapter) {
  return adapter && typeof adapter.getAdapter === 'function';
}
/**
 * parse or import object
 * @param {import("./types").ConnectionOptions|string|undefined} database
 * @returns {Promise<import("./types").ConnectionOptions|undefined>}
 */
async function useDatabase(database) {
  switch (typeof database) {
    case 'string': {
      // same field if protocol is file , import it
      // TODO: protocol json ?
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
  if (typeof adapter === 'string') {
    return importModule(adapter);
  }
  // adapter could've been initialized directly as dependency, mock?
  return adapter;
}
