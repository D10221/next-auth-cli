const assert = require("assert");
async function main() {
  const { default: nextAuthCli } = await import("next-auth-cli/index.js");
  assert(typeof nextAuthCli === "function");
  console.log("OK");
}
main()
  .then(() => {
    process.exit();
  })
  .catch((e) => {
    console.error(e);
    process.exit(-1);
  });
