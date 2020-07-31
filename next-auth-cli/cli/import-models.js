import module from "module";
import path from "path";
import { Models } from "./internal.js";
/**
 * @param {string} modulePath absolute or relative to cwd
 * @returns {Promise<any>}
 */
export default async function importModels(modulePath) {
  const relativePath = modulePath.startsWith(".")
    ? path.join(process.cwd(), modulePath)
    : modulePath;
  const require = module.createRequire(import.meta.url);
  const ret = require("esm")(new module.Module(relativePath))(relativePath);
  const ret1 = ret.default || ret;
  return typeof ret1 === "function" ? ret1(Models) : ret1;
}
