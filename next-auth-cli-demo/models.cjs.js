/**
 * DEMO custom Models (cjs)
 * adds a 'password' field to 'users'
 */
const adapters = require( "next-auth/adapters");
const models = adapters.TypeORM.Models;
module.exports = {
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
}