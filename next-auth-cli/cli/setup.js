import { namingStrategies, parse } from "./internal.js";
import importModels from "./import-models.js";
/**
 * Prepare initial config/models, 1st transform, converts strings into ... , if neccessary
 * @param {import("./types").ConnectionOptions|string} config
 * @param {import("./types").Models|string} [models]
 * @returns {Promise<[import("./types").ConnectionOptions, import("./types").Models]>}
 */
export default async function setup(config, models) {
  try {
    config = typeof config === "string" ? parse(config) : config;
    // parse adds search params as additional properties, naming strategy could've been set
    const namingStrategy =
      typeof config.namingStrategy === "string" &&
      config.namingStrategy in namingStrategies
        ? namingStrategies[config.namingStrategy]
        : config.namingStrategy;
    if (namingStrategy) {
      Object.assign(config, { namingStrategy });
    }
    return [
      config,
      typeof models === "string" ? await importModels(models) : models,
    ];
  } catch (error) {
    return Promise.reject(error);
  }
}
