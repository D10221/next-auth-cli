// ... allow require 'modules' ...
require = require("esm")(module /*, options*/);
// dont' do this
if (process.argv.indexOf("--require-extension") !== -1) {
  require("./require-extension");
}
module.exports = require("./index.js");
