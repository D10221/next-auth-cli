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
    const columns = Object.keys(schema.columns).map((key) => ({
      name: key,
      ...schema.columns[key],
    }));
    const indices = (Array.isArray(schema.indices) &&
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
