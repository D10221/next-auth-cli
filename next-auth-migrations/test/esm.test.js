describe("next-auth-migrations", () => {
  it("can be imported", async () => {
    const { default: migrations } = await import("../");
    expect(migrations).toBeInstanceOf(Function);
  });
});
