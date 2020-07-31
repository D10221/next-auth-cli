import Debug from "debug";
const debug = Debug("next-auth-cli/create-tables");
/**
 * @param {import("typeorm").Connection} connection
 * @param {import("typeorm").Table[]} tables
 * @param {{ ifNotExists?: boolean, createForeignKeys?: boolean,transaction?:boolean, createIndices?: boolean}} [options]
 * @returns {Promise<void>}
 */
export default async function createTables(connection, tables, options) {
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
      debug(`done: %s`, table.name);
    }
    if (queryRunner.isTransactionActive) await queryRunner.commitTransaction();
  } catch (error) {
    if (queryRunner.isTransactionActive)
      await queryRunner.rollbackTransaction();
    return Promise.reject(error);
  }
}
