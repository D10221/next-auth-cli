import Debug from "./debug.js";
const debug = Debug(
  import.meta
);
import typeorm from "typeorm";
/**
 *
 * @param {import("./types").Models} models
 * @param {{namingStrategy?: import("typeorm").NamingStrategyInterface, entityPrefix?: string}} [options]
 * @returns {import("typeorm").Table[]}
 */
export default function toTables(models, options) {
  const { namingStrategy, entityPrefix } = options || {};

  return Object.values(models).map(({ schema }) => {
    const tableName = namingStrategy
      ? namingStrategy.tableName(
          schema.name,
          entityPrefix && `${entityPrefix}${schema.name}`
        )
      : schema.name;

    const columns = Object.keys(schema.columns).map((key) => {
      const column = schema.columns[key];      
      // const columnName =(namingStrategy && namingStrategy.columnName(key, undefined, [])) || key;
      // debug("%s [%s] - %s [%s]:", schema.name, tableName, key, columnName, column);
      return {
        name: key, // columnName,
        ...column,
      };
    });

    const indices =
      (Array.isArray(schema.indices) &&
        schema.indices.map((index) => ({
          ...index,
          columnNames: index.columns,
        }))) ||
      [];
    return new typeorm.Table({
      ...schema,
      name: tableName,
      // TODO: apply 'namingStrategy' to columns
      columns,
      indices,
    });
  });
}
