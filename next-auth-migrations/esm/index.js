// @ts-ignore
import Adapters from "next-auth/adapters";
// @ts-ignore
import AdapterConfig from "next-auth/dist/adapters/typeorm/lib/config";
// @ts-ignore
import Transform from "next-auth/dist/adapters/typeorm/lib/transform";
import path from "path";
import { createConnection, Table } from "typeorm";
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
/**
 * @param {string} modulePath
 * @returns {Promise<any>}
 */
async function importModels(modulePath) {
  const _module = await import(
    modulePath.startsWith(".")
      ? path.join(process.cwd(), modulePath)
      : modulePath
  );
  return _module.default || _module;
}
/**
 *
 * @param {import("./types").Models} models
 * @param {{namingStrategy?: import("typeorm").NamingStrategyInterface, entityPrefix?: string}} [options]
 */
function toTables(models, options) {
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
    return new Table({
      ...schema,
      name: tableName,
      columns,
      indices,
    });
  });
}
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
      // ...
      connection = await createConnection(config);
      for await (const progress of createTables(connection, toTables(models))) {
        log && (await log("%s: done", progress));
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
 * @param {string} url
 */
function parse(url) {
  return AdapterConfig.parseConnectionString(url);
}
/**
 *
 * @param {[import("typeorm").ConnectionOptions, import("./types").Models]} args
 * @returns {[import("typeorm").ConnectionOptions, import("./types").Models]}
 */
const loadConfig = ([config, models]) => {
  AdapterConfig.loadConfig(config, { models });
  return [config, models];
};
/**
 *
 * @param {[import("typeorm").ConnectionOptions, import("./types").Models]} args
 * @returns {[import("typeorm").ConnectionOptions, import("./types").Models]}
 */
const transform = ([config, models]) => {
  Transform(config, models, config);
  return [config, models];
};
/**
 *
 * @param {import("typeorm").ConnectionOptions|string} config
 * @param {import("./types").Models|string} models
 * @returns {Promise<[import("typeorm").ConnectionOptions, import("./types").Models]>}
 */
const setup = async (config, models) => {
  try {
    return [
      typeof config === "string" ? await parse(config) : config,
      typeof models === "string" ? await importModels(models) : models,
    ];
  } catch (error) {
    return Promise.reject(error);
  }
};
/**
 * @param {import("typeorm").ConnectionOptions|string} config
 * @param {import("./types").Models|string} [models]
 * @param {(...args:any)=> any} [log]
 * @returns {Promise<void>}
 */
export default function (config, models = Adapters.TypeORM.Models, log) {
  return setup(config, models)
    .then(loadConfig)
    .then(transform)
    .then(runner(log));
}
