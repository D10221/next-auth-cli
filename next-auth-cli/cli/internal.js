// @ts-ignore
import Adapters from "next-auth/adapters.js";
// @ts-ignore
import AdapterConfig from "next-auth/dist/adapters/typeorm/lib/config.js";
// @ts-ignore
import NamingStrategies from "next-auth/dist/adapters/typeorm/lib/naming-strategies.js";
// @ts-ignore
import Transform from "next-auth/dist/adapters/typeorm/lib/transform.js";
// @ts-ignore
import NextAuthUtils from "next-auth/dist/adapters/typeorm/lib/utils.js";
/**
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
    // ? expects namingStrategy as options
    namingStrategy: config.namingStrategy,
  });
  return [
    loaded, //
    models,
  ];
};
/**
 *
 * @param {[import("./types").ConnectionOptions, import("./types").Models]} args
 * @returns {[import("./types").ConnectionOptions, import("./types").Models]}
 */
export const transform = ([config, models]) => {
  // tranform mutates models and options, expects 'namingStrategy' in options (3rd arg),
  // here we have it in config
  Transform.default(config, models, config);
  return [config, models];
};
/** @type {import("./types").Models} */
export const Models = Adapters.TypeORM.Models;
export const namingStrategies = NamingStrategies;
/**
 * @param {import("typeorm").Connection} connection
 * @param {*} entities
 */
export const updateConnectionEntities = (connection, entities) =>
  NextAuthUtils.updateConnectionEntities(connection, entities);
export const Adapter = Adapters.TypeORM.Adapter;