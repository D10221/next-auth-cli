const assert = require("assert");

describe("next-auth-cli-demo (cjs)", () => {
  it("syncs", async () => {
    const { default: nextAuthCli } = await import("next-auth-cli");
    const dbUrl = "sqlite://./temp/nextauth.sqlite";
    await nextAuthCli.sync(dbUrl);
  });
});
