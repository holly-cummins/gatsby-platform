import { generateFilter, filterOutDrafts } from "./filters";

describe("the graphql filter generation", () => {
  describe("in non-production environments", () => {
    it("gives a basic filter if there are no other filters", async () => {
      expect(generateFilter()).toEqual({ fields: { slug: { ne: "" } } });
    });

    it("combines the filters if a filter is passed in", async () => {
      expect(generateFilter({ frontmatter: { type: { eq: "frogs" } } })).toEqual({
        fields: { slug: { ne: "" } },
        frontmatter: { type: { eq: "frogs" } }
      });
    });

    it("handles dollar signs", async () => {
      expect(generateFilter({ frontmatter: { type: { eq: "$type" } } })).toEqual({
        fields: { slug: { ne: "" } },
        frontmatter: { type: { eq: "$type" } }
      });
    });
  });

  describe("in production environments", () => {
    const OLD_ENV = process.env;

    beforeEach(() => {
      jest.resetModules(); // Most important - it clears the cache
      process.env = { ...OLD_ENV }; // Make a copy
      process.env.ACTIVE_ENV = "production";
    });

    afterAll(() => {
      process.env = OLD_ENV; // Restore old environment
    });

    it("gives a basic filter if there are no other filters", async () => {
      expect(generateFilter()).toEqual({ fields: { slug: { ne: "" }, prefix: { ne: "draft" } } });
    });

    it("combines the filters if a filter is passed in", async () => {
      expect(generateFilter({ frontmatter: { type: { eq: "cats" } } })).toEqual({
        fields: { slug: { ne: "" }, prefix: { ne: "draft" } },
        frontmatter: { type: { eq: "cats" } }
      });
    });
  });
});

describe("the node filtering", () => {
  const draft = {
    node: {
      frontmatter: { category: "test-stuff" },
      fields: { source: "posts", slug: "not-yet", prefix: "draft" }
    }
  };
  const undated = {
    node: {
      frontmatter: { category: "final-stuff" },
      fields: { source: "posts", slug: "done-now" }
    }
  };
  const dated = {
    node: {
      frontmatter: { category: "final-stuff" },
      fields: { source: "posts", slug: "done-now", prefix: "2022-01-17" }
    }
  };
  const edges = [dated, draft, draft, undated];

  describe("in non-production environments", () => {
    it("leaves everything", async () => {
      expect(filterOutDrafts(edges)).toEqual(edges);
    });

    it("handles empty lists", async () => {
      expect(filterOutDrafts([])).toEqual([]);
    });
  });

  describe("in production environments", () => {
    const OLD_ENV = process.env;

    beforeEach(() => {
      jest.resetModules(); // Most important - it clears the cache
      process.env = { ...OLD_ENV }; // Make a copy
      process.env.ACTIVE_ENV = "production";
    });

    afterAll(() => {
      process.env = OLD_ENV; // Restore old environment
    });

    it("handles empty lists", async () => {
      expect(filterOutDrafts([])).toEqual([]);
    });

    it("handles empty nodes", async () => {
      expect(filterOutDrafts([{}])).toEqual([{}]);
    });

    it("strips out drafts", async () => {
      expect(filterOutDrafts(edges)).toEqual([dated, undated]);
    });
  });
});
