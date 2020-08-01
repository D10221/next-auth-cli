const assert = require("assert");

describe("next-auth-cli-demo (cjs)", () => {
  it("can be imported", async () => {
    const { default: nextAuthCli } = await import("next-auth-cli");
    assert.equal(nextAuthCli.name, "next-auth-cli");
  });
  // it("can't be required", () => {
  //   // noway to require an package with type module from cjs module
  //   let error;
  //   try {
  //     const loader = require("@local/loader");
  //     /** It fails, type="module" breaks all compatibility*/
  //     const nextAuthCli = loader(require, module)("next-auth-cli/index.js")
  //       .default;
  //     assert.equal(nextAuthCli.name, "next-auth-cli");
  //   } catch (e) {
  //     error = e;
  //   }
  //   assert.ok(error instanceof Error);
  // });
  it("syncs", async () => {
    const { default: nextAuthCli } = await import("next-auth-cli");
    const dbUrl = "sqlite://./temp/nextauth.sqlite";
    await nextAuthCli.sync(dbUrl);
    await import("next-auth/adapters.js")
        .default.Default.getAdapter()
        ._createUser({ name: "bob" })
  });
});
