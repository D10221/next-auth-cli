import { CONNECTION_STRINGS, unlinkSqlite } from "./common.js";
import assert from "assert";
import childProcess from "child_process";
import { binLocation } from "./common.js";
import cli from "next-auth-cli";

describe("next-auth-cli (module)", () => {
  // NOTE this tests work because of 'yarn' monorepo
  //
  it('"module" can be imported', () => {
    assert.equal(cli.name, "next-auth-cli");
  });

  it('"module" can be dynamically imported', async () => {
    const { default: imported } = await import("next-auth-cli");
    assert.equal(imported.name, "next-auth-cli");
    assert.strictEqual(imported, cli); // no leaks
  });
});

describe("next-auth-cli (cli)", function () {
  this.timeout(3000);
  this.beforeAll(unlinkSqlite);

  it("helps", () => {
    const stdout = run("--help");
    assert.ok(/next-auth-cli\s+<cmd>\s+\[args\]/i.test(stdout));
  });
  it(`syncs [config]`, function () {
    try {
      run("sync", "./test/next-auth-config.js");
      // TODO assert.equal(stdout , something)  ?
    } catch (error) {
      assert.fail(`syncs [config] FAILED`);
    }
  });
  // sync  --database
  for (const key in CONNECTION_STRINGS) {
    it(`syncs ${key} --database`, function () {
      try {
        run(
          "sync",
          "--database",
          // @ts-ignore
          CONNECTION_STRINGS[key]
        );
        // TODO assert.equal(stdout , something)  ?
      } catch (error) {
        assert.fail(`${key} sync FAILED`);
      }
    });
  }
  // sync  --database --adapter
  for (const key in CONNECTION_STRINGS) {
    it(`syncs ${key} --database --adapter`, function () {      
      try {
        run(
          "sync",
          "--database",
          // @ts-ignore
          CONNECTION_STRINGS[key],
          "--adapter",
          "./test/next-auth-adapter.js"
        );
        // TODO assert.equal(stdout , something)  ?
      } catch (error) {
        assert.fail(`${key} sync FAILED`);
      }
    });
  }
});
/**
 * @param {string[]} args
 */
function run(...args) {
  return childProcess.execSync(["node", binLocation, ...args].join(" "), {
    encoding: "utf-8",
  });
}
