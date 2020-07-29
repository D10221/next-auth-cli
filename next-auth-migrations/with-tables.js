import Adapters from "next-auth/adapters";
import { Table } from "typeorm";
/**
 * @description adds tables (TypeORM.Table[]) to adapter's config
 * @param { ReturnType<typeof adapterConfig.loadConfig> & { models?: typeof Adapters.TypeORM.Models, namingStrategy?: import('typeorm').NamingStrategyInterface, entityPrefix?: string }} configuration
 * @returns { ReturnType<typeof adapterConfig.loadConfig> & { models?: typeof Adapters.TypeORM.Models, namingStrategy?: import('typeorm').NamingStrategyInterface, entityPrefix?: string, tables: import('typeorm').Table[] }}
 * */
export default function withTables({
  models = Adapters.TypeORM.Models,
  namingStrategy,
  entityPrefix,
  ...etc
}) {
  return {
    ...etc,
    models,
    namingStrategy,
    entityPrefix,
    tables: Object.values(models).map(({ schema }) => {
      const columns = Object.keys(schema.columns).map((key) => ({
        name: key,
        ...schema.columns[key],
      }));
      const createIndices = schema.indices && !!schema.indices.length;
      const indices = createIndices &&
        schema.indices.map((index) => ({
          ...index,
          columnNames: index.columns,
        }));
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
    }),
  };
}
