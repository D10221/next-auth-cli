import childProcess from "child_process";
import module from "module";
import path from "path";
import assert from "assert";
const req = module.createRequire(import.meta.url);
const binLocation = path.join(
  path.dirname(req.resolve("next-auth-cli")),
  "bin/cli.js"
);

describe("next-auth-cli (bin)", () => {
  it("works", async () => {
    const stdout = childProcess.execSync(
      ["node", binLocation, "--help"].join(" "),
      {
        encoding: "utf-8",
      }
    );
    assert.ok(/next-auth-cli\s+<cmd>\s+\[args\]/i.test(stdout));
  });
});
