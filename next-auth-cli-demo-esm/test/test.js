import assert from "assert";
import nextAuthCli from "next-auth-cli";
describe("next-auth-cli-demo (esm)", () => {
  it("syncs", async () => {
    try {
      const dbUrl = "sqlite://./temp/nextauth.sqlite";
      await nextAuthCli.sync(dbUrl);      
    } catch (error) {
      assert.fail("next-auth-cli-demo (esm)");
    }
  });
});
