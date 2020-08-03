import assert from "assert";
import cli from "next-auth-cli";

describe("next-auth-cli (module)", () => {
  it('"module" can be imported', () => {
    assert.equal(cli.name, "next-auth-cli");
  });

  it('"module" can be dynamically imported', async () => {
    assert.equal((await import("next-auth-cli")).default.name, "next-auth-cli");
  });

  it('"module" doesn\'t leak imports', async () => {
    assert.strictEqual((await import("next-auth-cli")).default, cli);
  });
});
