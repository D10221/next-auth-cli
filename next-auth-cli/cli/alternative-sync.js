import typeorm from "typeorm";
import toTables from "./to-tables.js";
import { debug } from "./sync";
/**
 * Alternative
 * @param {[import("./types").ConnectionOptions, import("./types").Models ]} args
 * @returns {Promise<void>}
 * @deprecated 'duplicated functionality'
 */
export async function alternative_sync([config, models]) {
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
    }
    else {
      // ... alternatively? as in 'force' ... ?
      // ... run in a transaction
      const { default: createTables } = await import("./create-tables.js");
      await createTables(connection, toTables(models, config));
      debug("done");
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
