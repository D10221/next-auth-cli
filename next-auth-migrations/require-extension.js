import { readFileSync } from "fs";
/**
 * @description :P ... DON't Use this 'module'
 * @param {NodeRequire} require
 * @deprecated
 * */
export default (require) => {
  const compile = require.extensions[".js"];
  require.extensions[".js"] = (module, fileName) => {
    const content = readFileSync(fileName, "utf8");
    let ret = module._compile(content, fileName);
    // ... for some reason, sometimes, "module._compile" return undefined
    // give original extension a chance
    if (ret) return ret;
    if (compile !== module._compile) {
      // may throw if target/host 'package' is of type='module'
      ret = compile(module, fileName);
    }
    if (!ret)
      throw new Error(
        `Module '${fileName}' copiles to ${ret}, is it a module?`
      );
    return ret;
  };
  return require;
};
