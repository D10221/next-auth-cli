/**
 * esm compat: see ...
 */
// @ts-ignore
_require = require("esm")(module /*, options*/);

if (process.argv.indexOf("--esm-ext") !== -1) {
  const { readFileSync } = require("fs");
  const compile = _require.extensions[".js"];
  _require.extensions[".js"] = (module, fileName) => {
    const content = readFileSync(fileName, "utf8");
    // @ts-ignore
    let ret = module._compile(content, fileName);
    // ... for some reason, sometimes, "module._compile" return undefined
    if (ret) return ret;
    // @ts-ignore
    if (compile !== module._compile) {
      // give original extension a chance
      // may throw if host 'package' is of type='module'
      ret = compile(module, fileName);
    }
    if (!ret)
      throw new Error(
        `Module '${fileName}' copiles to ${ret}, is it a module?`
      );
    return ret;
  /*
    workaround for when host package is type="module"
   */
  };
}
/**
 * re-exported as 'cjs'
 * */
module.exports = _require("./esm/index.js");
