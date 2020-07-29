describe("next-auth-migrations", () => {
  it("can be required", () => {
    const { default: migrations} = require("../");
    expect(migrations).toBeInstanceOf(Function);
  }); 
});
