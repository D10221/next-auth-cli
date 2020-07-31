/**
 * DEMO custom Models, ESM format
 * adds a 'password' field to 'users'
 */
import Adapters from "next-auth/adapters.js";
const models = Adapters.TypeORM.Models;
export default {
  ...models,
  User: {
    ...models.User,
    schema: {
      ...models.User.schema,
      columns: {
        ...models.User.schema.columns,
        password: {
          type: "varchar",
          nullable: false,
        },
      },
    },
  },
};
