import assert from "assert";
import nextAuthCli from "next-auth-cli";
describe("next-auth-cli-demo (esm)", () => {
  it("can be imported", () => {
    assert.equal(nextAuthCli.name, "next-auth-cli");
  });
  it("syncs", async () => {
    try {
      const { default: nextAuthCli } = await import("next-auth-cli");
      const dbUrl = "mssql://nextauth:password@localhost:1433/nextauth";
      await nextAuthCli.sync(dbUrl);
      const { default: Adapters } = await import("next-auth/adapters.js");
      const a = Adapters.Default(dbUrl);
      const b = await a.getAdapter();
      b.createUser({ name: "bob" });      
    } catch (error) {
      assert.fail(error.message)
    }
  });
});
