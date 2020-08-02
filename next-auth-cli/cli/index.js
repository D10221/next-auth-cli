import Debug from "./debug.js";
import delayDrop from "./delay-drop.js";
import {
  loadConfig,
  Models,
  transform,
  updateConnectionEntities,
  Adapter,
} from "./internal.js";
import setup from "./setup.js";
import toTables from "./to-tables.js";
import withConnection from "./with-connection.js";
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
          await adapter.getUser();
        } catch (error) {
          return Promise.reject(error);
        }
      })
    );
/**
 * @description creates from next-auth models
 * @param {import("./types").ConnectionOptions|string} config
 * @param {{ models?: import("./types").Models|string} & { [key: string]: any }} [options]
 * @returns {Promise<void>}
 */
const createTables = (
  config,
  { models = Models, ...etc } = { models: Models }
) =>
  setup(config, models)
    .then(loadConfig)
    .then(transform)
    .then(withOptions(etc)) // Merge extra options
    .then(
      delayDrop(
        // NEW options: config.transaction,  config.createForeignKeys, config.createIndices, dropDatabase
        withConnection(async (connection, config, models) => {
          if (typeof config.database !== "string") {
            return Promise.reject(
              new Error(`Expected Database [${config.database}] to be 'string'`)
            );
          }
          const transaction = config.transaction !== false;
          const queryRunner = connection.createQueryRunner();
          try {
            if (transaction) await queryRunner.startTransaction();

            const tables = toTables(models, config);

            if (config.dropTables) {
              try {
                debug("droping tables");
                const queryRunner = connection.createQueryRunner();
                for (const table of tables) {
                  await queryRunner.dropTable(table, true, true, true);
                }
              } catch (error) {
                Debug("Can't drop tables");
                Debug(error);
              }
            }
            for (const table of tables) {
              debug(`create: %s`, table.name);
              await queryRunner.createTable(
                table,
                true, // ifNotExists,
                config.createForeignKeys,
                config.createIndices ||
                  (table.indices && !!table.indices.length)
              );
            }
            if (queryRunner.isTransactionActive)
              await queryRunner.commitTransaction();
          } catch (error) {
            if (queryRunner.isTransactionActive)
              await queryRunner.rollbackTransaction();
            return Promise.reject(error);
          }
        })
      )
    );
/**
 * @description Drop database
 * @param {import("./types").ConnectionOptions|string} config
 * @param {{ models?: import("./types").Models|string} & { [key: string]: any }} [options]
 * @returns {Promise<void>}
 */
const dropDatabase = (
  config,
  { models = Models, ...options } = { models: Models }
) =>
  setup(config, models)
    .then(loadConfig)
    .then(transform)
    .then(withOptions(options)) // Merge extra options
    .then(
      delayDrop(
        // NEW options: config.transaction,  config.createForeignKeys, config.createIndices, dropDatabase
        withConnection(async (connection, config, models) => {
          /**
           * TODO: SQL server: needs to connect to master , to drop,create the database !!!
           */
          if (typeof config.database !== "string") {
            return Promise.reject(
              new Error(`Expected Database [${config.database}] to be 'string'`)
            );
          }
          try {
            const queryRunner = connection.createQueryRunner();
            if (config.dropDatabase) {
              debug("dropping database");
              await queryRunner.dropDatabase(config.database);
            }
            if (config.createDatabase) {
              debug("creating database");
              await queryRunner.createDatabase(config.database);
            }
          } catch (error) {
            return Promise.reject(error);
          }
        })
      )
    );
/**
 *
 */
export default {
  name: "next-auth-cli",
  sync,
  createTables,
  dropDatabase,
};
