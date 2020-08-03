import cli from "next-auth-cli";
import { CONNECTION_STRINGS } from "./config.js";
import assert from "assert";

describe("next-auth-cli (cli)", function () {
  // Test Only sqlite on unit test?
  // Test other adapter with shell, isolate process ?
  for (const key in CONNECTION_STRINGS) {
    it(`syncs ${key}`, async function () {
      if (1 === 1) this.skip();
      try {
        // Needs to reset Config?
        await cli.sync(CONNECTION_STRINGS[key]);
      } catch (error) {
        assert.fail(`${key} sync FAILED`);
      }
    });
  } // Test Only sqlite on unit test?
});
