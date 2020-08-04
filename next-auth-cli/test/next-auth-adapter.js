// @ts-ignore
import Adapters from "next-auth/adapters.js";
// @ts-ignore
import NamingStrategies from "next-auth/dist/adapters/typeorm/lib/naming-strategies.js";
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
            type: "varchar",
            nullable: false,
          },
        },
      },
    },
  };
}
/**
 * @param {*} config
 * @param {*} options
 */
export default (config, options = {}) => {
  return Adapters.TypeORM.Adapter(config, {
    ...options,
    models: custom(Adapters.TypeORM.Models),
    // namingStrategy is optional
    namingStrategy: NamingStrategies.SnakeCaseNamingStrategy.default,
  });
};
