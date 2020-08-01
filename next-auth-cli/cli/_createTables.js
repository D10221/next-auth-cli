import typeorm from "typeorm";
import toTables from "./to-tables.js";
import Debug from "./debug.js";
const debug = Debug(
  import.meta.url || (typeof module !== "undefined" && module.filename) || ""
);
/**
 * Alternative
 * @param {[import("./types").ConnectionOptions, import("./types").Models ]} args
 * @returns {Promise<void>}
 * @deprecated 'duplicated functionality'
 */
export default async function _createTables([config, models]) {
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
    const { default: createTables } = await import("./create-tables.js");
    await createTables(connection, toTables(models, config));
    debug("done");
  } catch (error) {
    return Promise.reject(error);
  } finally {
    if (connection && connection.isConnected) {
      connection.close();
    }
  }
}
