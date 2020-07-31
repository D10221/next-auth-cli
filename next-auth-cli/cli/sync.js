import typeorm from "typeorm";
import toTables from "./to-tables.js";
import createTables from "./create-tables.js";
import Debug from "debug";
const debug = Debug("next-auth-cli/sync");
/**
 * @param {[import("./types").ConnectionOptions, import("./types").Models ]} args
 * @returns {Promise<void>}
 */
export default async function Sync([config, models]) {
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
      // ...
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
