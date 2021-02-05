import { plural } from "./type";

describe("the type descriptions", () => {
  it("pluralises correctly in the simple case", async () => {
    expect(plural("book")).toBe("books");
  });

  it("pluralises correctly for media", async () => {
    expect(plural("media")).toBe("media");
  });
});
