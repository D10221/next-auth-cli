// @ts-ignore
import Adapters from 'next-auth/adapters.js';
// @ts-ignore
import AdapterConfig from 'next-auth/dist/adapters/typeorm/lib/config.js';
// @ts-ignore
import { SnakeCaseNamingStrategy } from 'next-auth/dist/adapters/typeorm/lib/naming-strategies.js';
/**
 * Adds extra field to standard models
 * @param {*} Models
 */
function custom(Models) {
  return {
    ...Models,
    User: {
      ...Models.User,
      schema: {
        ...Models.User.schema,
        columns: {
          ...Models.User.schema.columns,
          password: {
            type: 'varchar',
            nullable: false,
          },
        },
      },
    },
  };
}
/**
 * URL to connection options
 * @param {string} url
 */
function parse(url) {
  return AdapterConfig.parseConnectionString(url);
}
/**
 * Wraps default adapter, cusomizing models
 * Behaves like 'standard' adapter
 * @param {*} database
 * @param {*} options
 */
export default (database, options = {}) => {
  let _initial = buildAdapter(database, options);
  return {
    // Adapter knows how to synchronize on demmand
    /**
     * Without this it can't be simply 'cli sync my-config.js'
     * @param {*} [options]
     */
    getAdapter(options) {
      if (!options || !options.synchronize) {
        return _initial.getAdapter(options);
      }
      _initial = buildAdapter(database, options);
      return _initial.getAdapter(options);
    },
  };
};
/**
 * @param {*} database
 * @param {*} options
 * TODO: cache, memoize this function based on database, options
 */
function buildAdapter(database, options) {
  const _database = typeof database === 'string' ? parse(database) : database;
  if (options && options.synchronize) {
    _database.synchronize = true;
  }
  return Adapters.TypeORM.Adapter(_database, {
    ...options,
    models: custom(Adapters.TypeORM.Models),
    // namingStrategy is optional
    namingStrategy: new SnakeCaseNamingStrategy(),
  });
}
