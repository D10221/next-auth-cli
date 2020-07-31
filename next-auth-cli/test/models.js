/**
 * DEMO custom Models
 * add a 'password' field to 'users'
 */
// @ts-ignore
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
