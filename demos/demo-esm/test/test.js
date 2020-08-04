import nextAuthCli from "next-auth-cli";
describe("next-auth-cli-demo (esm)", () => {
  it("syncs", async () => {
    const dbUrl = "sqlite://./temp/nextauth.sqlite";
    await nextAuthCli.sync(null, dbUrl, null, {});    
  });
});
