import adapter from "./next-auth-adapter.js";
import { CONNECTION_STRINGS } from "./common.js";
/**
 * Next-auth configuration
 * Same as expected by 'next-auth'
 */
export default {
  /**
   * @param {string|{}} [database]
   * @param {{}} [opts]
   */
  adapter: (database = CONNECTION_STRINGS.SQLITE, opts) =>
    adapter(database, opts),
  database: CONNECTION_STRINGS.SQLITE,
};
