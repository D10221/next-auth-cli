const assert = require("assert");

describe("next-auth-cli-demo (cjs)", () => {
  it("can be imported", async () => {
    const { default: nextAuthCli } = await import("next-auth-cli");
    assert.ok(typeof nextAuthCli === "function");
  });
  it("can be required (FAILS)", () => {
    const loader = require("@local/loader");
    /** It fails, type="module" breeaks all compatibility*/
    const nextAuthCli = loader(require, module)("next-auth-cli/index.js")
      .default;
    assert.ok(typeof nextAuthCli === "function");
  });
});
