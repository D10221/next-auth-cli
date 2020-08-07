// @ts-ignore
import Adapters from 'next-auth/adapters.js';
// @ts-ignore
import AdapterConfig from 'next-auth/dist/adapters/typeorm/lib/config.js';
/**
 * URL to connection options
 * @param {string} url
 * @returns {import("./types").ConnectionOptions}
 */
export function parse(url) {
  return AdapterConfig.default.parseConnectionString(url);
}
/**
 * adds defaults to configuration/ConnectionOptions
 * @param {[import("./types").ConnectionOptions, import("./types").Models]} args
 * @returns {[import("./types").ConnectionOptions, import("./types").Models]}
 */
export const loadConfig = ([config, models]) => {
  const loaded = AdapterConfig.default.loadConfig(config, {
    models,
    // ? expects namingStrategy as option
    namingStrategy: config.namingStrategy,
  });
  return [
    loaded, //
    models,
  ];
};
/**
 * @type {*} default 'next-auth' adapter
 */
export const Adapter = Adapters.TypeORM.Adapter;
