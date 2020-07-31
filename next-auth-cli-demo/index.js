const assert = require("assert");
/** It fails, type="module" breaks all compatibility*/
require = require("esm")(module);
const nextAuthCli = require("next-auth-cli/index.js").default;
assert.ok(typeof nextAuthCli === "function");
