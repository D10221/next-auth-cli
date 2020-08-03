import typeorm from "typeorm";
import Debug from "./debug.js";
const debug = Debug(
  import.meta
);
/**
 * @param {(con: import("typeorm").Connection, config: import("./types").ConnectionOptions, models: import("./types").Models)=> any} callback
 */
export default function withConnection(callback) {
  return (
    /**
    @param {[import("./types").ConnectionOptions, import("./types").Models]} args
   */
    async function x([config, models]) {
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
        debug((await callback(connection, config, models)) || "done");
      } catch (error) {
        return Promise.reject(error);
      } finally {
        if (connection && connection.isConnected) {
          debug("closing connection:", connection.name);
          await connection.close().catch(debug);
        }
      }
    }
  );
}
