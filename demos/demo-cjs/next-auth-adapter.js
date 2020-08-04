// @ts-ignore
import Adapters from "next-auth/adapters.js";
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
  });
};
