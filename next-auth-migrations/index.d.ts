/**
 *
 * @param {import("./types").Models} models
 * @param {{namingStrategy?: import("typeorm").NamingStrategyInterface, entityPrefix?: string}} [options]
 */
export function toTables(models: import("./types").Models, options?: {
    namingStrategy?: typeorm.NamingStrategyInterface | undefined;
    entityPrefix?: string | undefined;
} | undefined): typeorm.Table[];
/**
 * @param {import("typeorm").ConnectionOptions|string} config
 * @param {import("./types").Models|string} [models]
 * @param {(...args:any)=> any} [log]
 * @returns {Promise<void>}
 */
export default function nextAuthMigration(config: import("typeorm").ConnectionOptions | string, models?: string | import("./types").Models | undefined, log?: ((...args: any) => any) | undefined): Promise<void>;
export function loadConfig([config, models]: [import("typeorm").ConnectionOptions, import("./types").Models]): [import("typeorm").ConnectionOptions, import("./types").Models];
export function transform([config, models]: [import("typeorm").ConnectionOptions, import("./types").Models]): [import("typeorm").ConnectionOptions, import("./types").Models];
export function setup(config: import("typeorm").ConnectionOptions | string, models: import("./types").Models | string): Promise<[import("typeorm").ConnectionOptions, import("./types").Models]>;
import typeorm from "typeorm";
