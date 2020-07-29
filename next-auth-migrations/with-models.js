import adapterConfig from "next-auth//dist/adapters/typeorm/lib/config";
import transform from "next-auth//dist/adapters/typeorm/lib/transform";
import Adapters from "next-auth/adapters";
/**
 * @description Prepare config for migration, adds models and naming strategy to configuration object
 * @param {string|{}} urlOrConfig database url or typeORM config object
 * @param { typeof Adapters.TypeORM.Models | undefined} models or custom models
 * @returns { ReturnType<typeof adapterConfig.loadConfig> & { models: typeof Adapters.TypeORM.Models, namingStrategy?: import('typeorm').NamingStrategyInterface, entityPrefix?: string }} NextAuth.Adapter.Config & { models }
 */
export default function withModels(urlOrConfig, models) {
  models = models || Adapters.TypeORM.Models;
  const config = adapterConfig.loadConfig(
    typeof urlOrConfig === "object"
      ? urlOrConfig
      : adapterConfig.parseConnectionString(urlOrConfig),
    {
      models,
    }
  );
  // transform columns and assign namingStrategy
  transform(config, models, config);
  // ... return as 'one thing'
  return { ...config, models };
}

