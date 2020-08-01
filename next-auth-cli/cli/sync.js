import typeorm from "typeorm";
import toTables from "./to-tables.js";
import Debug from "debug";
const debug = Debug("next-auth-cli/sync");
/**
 * @param {[import("./types").ConnectionOptions, import("./types").Models ]} args
 * @returns {Promise<void>}
 */
export default async function sync([config, models]) {
  let connection;
  try {
    debug(
      "connecting as %s to %s://%s:%s/%s",
      config.name,
      config.type,
      config.host,
      config.port,
      config.database
    );
    connection = await typeorm.createConnection(config);
    await connection.synchronize(
      // "&dropSchema=true|yes|YES?"
      config.dropSchema
    );
    debug("synchronized.");
  } catch (error) {
    return Promise.reject(error);
  } finally {
    if (connection && connection.isConnected) {
      connection.close();
    }
  }
}
/**
 * Alternative
 * @param {[import("./types").ConnectionOptions, import("./types").Models ]} args
 * @returns {Promise<void>}
 * @deprecated 'duplicated functionality'
 */
export async function _sync([config, models]) {
  let connection;
  try {
    debug(
      "connecting as %s to %s://%s:%s/%s",
      config.name,
      config.type,
      config.host,
      config.port,
      config.database
    );
    connection = await typeorm.createConnection(config);
    if (config.synchronize) {
      // if "?synchronize=true" just sync
      await connection.synchronize(
        // "&dropSchema=true"
        config.dropSchema
      );
      debug("synchronized.");
    } else {
      // ... alternatively? as in 'force' ... ?
      // ... run in a transaction
      const { default: createTables } = await import("./create-tables.js");
      await createTables(connection, toTables(models, config));
      debug("done");
    }
  } catch (error) {
    return Promise.reject(error);
  } finally {
    if (connection && connection.isConnected) {
      connection.close();
    }
  }
}
