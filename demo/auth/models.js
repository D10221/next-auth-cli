/**
 * Adds extra field to standard models
 * @param {*} nextAuthModels
 */
export default function models(nextAuthModels) {
  return {
    ...nextAuthModels,
    User: {
      ...nextAuthModels.User,
      schema: {
        ...nextAuthModels.User.schema,
        columns: {
          ...nextAuthModels.User.schema.columns,
          password: {
            type: "varchar",
            nullable: false,
          },
        },
      },
    },
  };
}
