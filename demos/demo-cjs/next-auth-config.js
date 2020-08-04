import adapter from "./next-auth-adapter.js";
/**
 * Next-auth configuration
 * Same as expected by 'next-auth'
 */
export default {
  /**
   * @param {string|{}} [database]
   * @param {{}} [opts]
   */
  adapter,
  database: "sqlite://./temp/nextauth.sqlite",
};
