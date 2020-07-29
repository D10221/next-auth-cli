import { createConnection } from "typeorm";
/**
 * 'Migrate:up'/create tables as in typeorm.Table[]
 * @param {import("typeorm").ConnectionOptions  & { tables: Table[], ifNotExists?: boolean, createForeignKeys?: boolean, createIndices?: boolean } config
 * @returns {AsyncGenerator<string>}
 */
export default async function* createTables({
  ifNotExists = true,
  createForeignKeys = false,
  createIndices = false,
  tables,
  ...etc // TypeORM config
}) {
  try {
    const connection = await createConnection(etc);
    const runner = connection.createQueryRunner();
    await runner.startTransaction();
    try {
      for (const table of tables) {
        // if (table.name === "sessions") throw new Error("Wtf");
        await runner.createTable(
          table,
          ifNotExists,
          createForeignKeys,
          createIndices || (table.indices && !!table.indices.length)
        );
        yield `${table.name}`;
      }
      await runner.commitTransaction();
    } catch (error) {
      await runner.rollbackTransaction();
      throw error;
    }
  } catch (error) {
    return Promise.reject(error);
  }
}
