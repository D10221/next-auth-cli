// @ts-ignore
import Adapters from "next-auth/adapters.js";
// @ts-ignore
import AdapterConfig from "next-auth/dist/adapters/typeorm/lib/config.js";
// @ts-ignore
import Transform from "next-auth/dist/adapters/typeorm/lib/transform.js";
// @ts-ignore
import namingStrategies from "next-auth/dist/adapters/typeorm/lib/naming-strategies.js";
import path from "path";
import typeorm from "typeorm";
/**
 * @param {import("typeorm").Connection} connection
 * @param {import("typeorm").Table[]} tables
 * @param {{ ifNotExists?: boolean, createForeignKeys?: boolean,transaction?:boolean, createIndices?: boolean}} [options]
 */
async function* createTables(connection, tables, options) {
  const { ifNotExists, createForeignKeys, createIndices, transaction } = {
    ifNotExists: true,
    createForeignKeys: false,
    createIndices: false,
    transaction: true,
    ...(options || {}),
  };
  const queryRunner = connection.createQueryRunner();
  try {
    if (transaction) await queryRunner.startTransaction();
    for (const table of tables) {
      await queryRunner.createTable(
        table,
        ifNotExists,
        createForeignKeys,
        createIndices || (table.indices && !!table.indices.length)
      );
      yield `${table.name}`;
    }
    if (queryRunner.isTransactionActive) await queryRunner.commitTransaction();
  } catch (error) {
    if (queryRunner.isTransactionActive)
      await queryRunner.rollbackTransaction();
    return Promise.reject(error);
  }
}
import module from "module";
/**
 * @param {string} modulePath absolute or relative to cwd
 * @returns {Promise<any>}
 */
async function importModels(modulePath) {
  const relativePath = modulePath.startsWith(".")
    ? path.join(process.cwd(), modulePath)
    : modulePath;
  const require = module.createRequire(import.meta.url);
  const ret = require("esm")(new module.Module(relativePath))(relativePath);
  const ret1 = ret.default || ret;
  return typeof ret1 === "function" ? ret1(Adapters.TypeORM.Models) : ret1;
}
/**
 *
 * @param {import("./types").Models} models
 * @param {{namingStrategy?: import("typeorm").NamingStrategyInterface, entityPrefix?: string}} [options]
 * @returns {import("typeorm").Table[]}
 */
export function toTables(models, options) {
  const { namingStrategy, entityPrefix } = options || {};
  return Object.values(models).map(({ schema }) => {
    const columns = Object.keys(schema.columns).map((key) => ({
      name: key,
      ...schema.columns[key],
    }));
    const indices =
      (Array.isArray(schema.indices) &&
        schema.indices.map((index) => ({
          ...index,
          columnNames: index.columns,
        }))) ||
      [];
    const tableName = namingStrategy
      ? namingStrategy.tableName(
          schema.name,
          entityPrefix && `${entityPrefix}${schema.name}`
        )
      : schema.name;
    return new typeorm.Table({
      ...schema,
      name: tableName,
      columns,
      indices,
    });
  });
}
/**
 * @param {string} url
 * @returns {import("typeorm").ConnectionOptions}
 */
function parse(url) {
  return AdapterConfig.default.parseConnectionString(url);
}
/**
 * adds defaults to configuration/ConnectionOptions
 * @param {[import("typeorm").ConnectionOptions, import("./types").Models]} args
 * @returns {[import("typeorm").ConnectionOptions, import("./types").Models]}
 */
export const loadConfig = ([config, models]) => {
  return [
    AdapterConfig.default.loadConfig(config, {
      models,
      // ? expects namingStrategy as options
      namingStrategy: config.namingStrategy,
    }), //
    models,
  ];
};
/**
 *
 * @param {[import("typeorm").ConnectionOptions, import("./types").Models]} args
 * @returns {[import("typeorm").ConnectionOptions, import("./types").Models]}
 */
export const transform = ([config, models]) => {
  // tranform mutates models and options, expects 'namingStrategy' in options (3rd arg),
  // here we have it in config
  Transform.default(config, models, config);
  return [config, models];
};
/**
 * Prepare initial config/models, 1st transform, converts strings into ... , if neccessary
 * @param {import("typeorm").ConnectionOptions|string} config
 * @param {import("./types").Models|string} models
 * @returns {Promise<[import("typeorm").ConnectionOptions, import("./types").Models]>}
 */
export const setup = async (config, models) => {
  try {
    config = typeof config === "string" ? parse(config) : config;
    // parse adds search params as additional properties, naming strategy could've been set
    const namingStrategy =
      typeof config.namingStrategy === "string" &&
      config.namingStrategy in namingStrategies
        ? namingStrategies[config.namingStrategy]
        : config.namingStrategy;
    if (namingStrategy) {
      Object.assign(config, { namingStrategy });
    }
    return [
      config,
      typeof models === "string" ? await importModels(models) : models,
    ];
  } catch (error) {
    return Promise.reject(error);
  }
};
/**
 * @param {(...args:any)=> any} [log]
 * */
function runner(log) {
  /**
   * @param {[import("typeorm").ConnectionOptions, import("./types").Models]} args
   * @returns {Promise<void>}
   */
  async function run([config, models]) {
    let connection;
    try {
      connection = await typeorm.createConnection(config);
      if (config.synchronize) {
        // if "?synchronize=true" just sync
        await connection.synchronize(
          // "&dropSchema=true"
          config.dropSchema
        );
        log && log("synchronized.");
      } else {
        // ...
        for await (const progress of createTables(
          connection,
          toTables(models, config)
        )) {
          log && (await log("%s: done", progress));
        }
      }
    } catch (error) {
      return Promise.reject(error);
    } finally {
      if (connection && connection.isConnected) {
        connection.close();
      }
    }
  }
  return run;
}
/**
 * @param {import("typeorm").ConnectionOptions|string} config
 * @param {import("./types").Models|string} [models]
 * @param {(...args:any)=> any} [log]
 * @returns {Promise<void>}
 */
export default function nextAuthMigration(
  config,
  models = Adapters.TypeORM.Models,
  log
) {
  return setup(config, models)
    .then(loadConfig)
    .then(transform)
    .then(runner(log));
}
