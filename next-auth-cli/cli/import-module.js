import module from 'module';
import path from 'path';
import Debug from 'debug';
const debug = Debug('next-auth-cli:import-module');
/**
 * @param {string} modulePath absolute or relative to cwd
 * @returns {Promise<any>}
 */
export default async function importModule(modulePath) {
  try {
    const relativePath = modulePath.startsWith('.')
      ? path.join(process.cwd(), modulePath)
      : modulePath;
    let ret;
    try {
      // try native import
      ret = await import('file://' + path.posix.normalize(relativePath));
    } catch (error) {
      debug(error);
      // last chance try use esm interop.
      const require = module.createRequire(import.meta.url);
      ret = require('esm')(new module.Module(import.meta.url))(relativePath);
    }
    return (ret && ret.default) || ret;
  } catch (error) {
    return Promise.reject(error);
  }
}
