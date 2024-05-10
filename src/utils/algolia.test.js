import algolia from "./algolia";

describe("the algolia indexing", () => {
  describe("when the data is complete", () => {
    const node = {
      fields: { slug: "sluggish", prefix: "2020-01-06" },
      frontmatter: {
        title: "an exciting node",
        category: "dull-stuff",
        author: "tdd-er"
      },
      internal: { content: "the guts" }
    };

    it("returns a chunk", async () => {
      const chunked = algolia([], { node });
      expect(chunked).toBeTruthy();
      expect(chunked).toHaveLength(1);
    });
  });

  describe("when the data is very long", () => {
    const node = {
      fields: { slug: "sluggish", prefix: "2020-01-06" },
      frontmatter: {
        title: "an exciting node",
        category: "dull-stuff",
        author: "tdd-er"
      },
      internal: { content: "x".repeat(11000) }
    };

    it("returns several chunks", async () => {
      const chunked = algolia([], { node });
      expect(chunked).toBeTruthy();
      expect(chunked).toHaveLength(3); // There should be two lots of 5000 and one leftover
    });
  });

  describe("when the data is incomplete", () => {
    const node = {
      fields: { slug: "sluggish", prefix: "2020-01-06" },
      frontmatter: {
        title: "an exciting node",
        category: "dull-stuff",
        author: "tdd-er"
      },
      internal: { content: "" }
    };
    it("handles empty content gracefully", async () => {
      const chunked = algolia([], { node });
      expect(chunked).toBeTruthy();
    });
  });
});
