import adapter from './next-auth-external-adapter.js';
import { CONNECTION_STRINGS } from './common.js';
const database = CONNECTION_STRINGS.SQLITE;
/**
 * Next-auth configuration
 * Same as expected by 'next-auth'
 */
const config = {
  // It has to be initialized to work with 'next-auth'
  adapter: adapter(database),
  database,
};
export default config;
