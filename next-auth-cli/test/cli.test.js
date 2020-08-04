import { CONNECTION_STRINGS, unlinkSqlite } from "./common.js";
import assert from "assert";
import childProcess from "child_process";
import { binLocation } from "./common.js";
import cli from "next-auth-cli";

describe("next-auth-cli (module)", () => {
  it('"module" can be imported', () => {
    assert.equal(cli.name, "next-auth-cli");
  });

  it('"module" can be dynamically imported', async () => {
    assert.equal((await import("next-auth-cli")).default.name, "next-auth-cli");
  });
});

describe("next-auth-cli (cli)", function () {
  this.beforeAll(unlinkSqlite);

  it("helps", () => {
    const stdout = run("--help");
    assert.ok(/next-auth-cli\s+<cmd>\s+\[args\]/i.test(stdout));
  });
  // Test Only sqlite on unit test?
  // Test other adapter with shell, isolate process ?
  for (const key in CONNECTION_STRINGS) {
    it(`syncs ${key} --database`, function () {
      // if (1 === 1) this.skip(); //disabled!
      try {
        // @ts-ignore
        run("sync", "--database", CONNECTION_STRINGS[key]);
        // assert.equal(stdout , something)  ?
      } catch (error) {
        assert.fail(`${key} sync FAILED`);
      }
    });
  } // Test Only sqlite on unit test?
});

/**
 * @param {string[]} args
 */
function run(...args) {
  return childProcess.execSync(["node", binLocation, ...args].join(" "), {
    encoding: "utf-8",
  });
}
