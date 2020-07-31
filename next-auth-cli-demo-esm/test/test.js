import assert from "assert"
import nextAuthCli from "next-auth-cli"
describe("next-auth-cli-demo (esm)", () => {
  it("can be imported", () => {
      assert.ok(typeof nextAuthCli === "function");
  });
});
