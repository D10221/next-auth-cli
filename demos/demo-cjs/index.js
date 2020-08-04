const assert = require("assert");
async function main() {
  const { default: nextAuthCli } = await import("next-auth-cli/index.js");
  assert.equal(nextAuthCli.name, "next-auth-cli");
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
