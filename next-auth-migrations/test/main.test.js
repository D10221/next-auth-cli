const { describe } = require("yargs");
const migrations = require("../");
describe("next-auth-migrations", () => {
  it("can be required", async () => {
    expect(migrations).toBe(undefined);
  });
});
