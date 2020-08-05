import Adapters from "next-auth/adapters";
import models from "./models";
/**
 * @param {*} config
 * @param {*} options
 */
export default (config, options = {}) => {
  const adapter = Adapters.TypeORM.Adapter(config, {
    ...options,
    models: models(Adapters.TypeORM.Models),
  });
  Object.assign(adapter, { name: "my-adapter" });
  return adapter;
};
