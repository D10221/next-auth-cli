"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ignore
const adapters_1 = __importDefault(require("next-auth/adapters"));
// @ts-ignore
const config_1 = __importDefault(require("next-auth/dist/adapters/typeorm/lib/config"));
// @ts-ignore
const transform_1 = __importDefault(require("next-auth/dist/adapters/typeorm/lib/transform"));
const path_1 = __importDefault(require("path"));
const typeorm_1 = require("typeorm");
/**
 * @param {import("typeorm").Connection} connection
 * @param {import("typeorm").Table[]} tables
 * @param {{ ifNotExists?: boolean, createForeignKeys?: boolean,transaction?:boolean, createIndices?: boolean}} [options]
 */
async function* createTables(connection, tables, options) {
    const { ifNotExists, createForeignKeys, createIndices, transaction } = {
        ifNotExists: true,
        createForeignKeys: false,
        createIndices: false,
        transaction: true,
        ...(options || {}),
    };
    const queryRunner = connection.createQueryRunner();
    try {
        if (transaction)
            await queryRunner.startTransaction();
        for (const table of tables) {
            await queryRunner.createTable(table, ifNotExists, createForeignKeys, createIndices || (table.indices && !!table.indices.length));
            yield `${table.name}`;
        }
        if (queryRunner.isTransactionActive)
            await queryRunner.commitTransaction();
    }
    catch (error) {
        if (queryRunner.isTransactionActive)
            await queryRunner.rollbackTransaction();
        return Promise.reject(error);
    }
}
/**
 * @param {string} modulePath
 * @returns {Promise<any>}
 */
async function importModels(modulePath) {
    const _module = await Promise.resolve().then(() => __importStar(require(modulePath.startsWith(".")
        ? path_1.default.join(process.cwd(), modulePath)
        : modulePath)));
    return _module.default || _module;
}
/**
 *
 * @param {import("./types").Models} models
 * @param {{namingStrategy?: import("typeorm").NamingStrategyInterface, entityPrefix?: string}} [options]
 */
function toTables(models, options) {
    const { namingStrategy, entityPrefix } = options || {};
    return Object.values(models).map(({ schema }) => {
        const columns = Object.keys(schema.columns).map((key) => ({
            name: key,
            ...schema.columns[key],
        }));
        const indices = (Array.isArray(schema.indices) &&
            schema.indices.map((index) => ({
                ...index,
                columnNames: index.columns,
            }))) ||
            [];
        const tableName = namingStrategy
            ? namingStrategy.tableName(schema.name, entityPrefix && `${entityPrefix}${schema.name}`)
            : schema.name;
        return new typeorm_1.Table({
            ...schema,
            name: tableName,
            columns,
            indices,
        });
    });
}
/**
 * @param {(...args:any)=> any} [log]
 * */
function runner(log) {
    /**
     * @param {[import("typeorm").ConnectionOptions, import("./types").Models]} args
     * @returns {Promise<void>}
     */
    async function run([config, models]) {
        let connection;
        try {
            // ...
            connection = await typeorm_1.createConnection(config);
            for await (const progress of createTables(connection, toTables(models))) {
                log && (await log("%s: done", progress));
            }
        }
        catch (error) {
            return Promise.reject(error);
        }
        finally {
            if (connection && connection.isConnected) {
                connection.close();
            }
        }
    }
    return run;
}
/**
 * @param {string} url
 */
function parse(url) {
    return config_1.default.parseConnectionString(url);
}
/**
 *
 * @param {[import("typeorm").ConnectionOptions, import("./types").Models]} args
 * @returns {[import("typeorm").ConnectionOptions, import("./types").Models]}
 */
const loadConfig = ([config, models]) => {
    config_1.default.loadConfig(config, { models });
    return [config, models];
};
/**
 *
 * @param {[import("typeorm").ConnectionOptions, import("./types").Models]} args
 * @returns {[import("typeorm").ConnectionOptions, import("./types").Models]}
 */
const transform = ([config, models]) => {
    transform_1.default(config, models, config);
    return [config, models];
};
/**
 *
 * @param {import("typeorm").ConnectionOptions|string} config
 * @param {import("./types").Models|string} models
 * @returns {Promise<[import("typeorm").ConnectionOptions, import("./types").Models]>}
 */
const setup = async (config, models) => {
    try {
        return [
            typeof config === "string" ? await parse(config) : config,
            typeof models === "string" ? await importModels(models) : models,
        ];
    }
    catch (error) {
        return Promise.reject(error);
    }
};
/**
 * @param {import("typeorm").ConnectionOptions|string} config
 * @param {import("./types").Models|string} [models]
 * @param {(...args:any)=> any} [log]
 * @returns {Promise<void>}
 */
function default_1(config, models = adapters_1.default.TypeORM.Models, log) {
    return setup(config, models)
        .then(loadConfig)
        .then(transform)
        .then(runner(log));
}
exports.default = default_1;
