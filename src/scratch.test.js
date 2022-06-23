const { curly } = require("node-libcurl");
const url = "https://www.digit.fyi/comment-why-i-never-want-to-build-another-mvp/";

describe("try", () => {
  it("gives 200", async () => {
    const { statusCode } = await curly.get(url);
    expect(statusCode).toEqual(200);
  });
});
