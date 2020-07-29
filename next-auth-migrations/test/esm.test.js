describe("next-auth-migrations", () => {
  it("can be required", async () => {
    const { default: migrations } = await import("../");
    expect(migrations).toBeInstanceOf(Function);
  });
});
