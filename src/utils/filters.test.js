import { generateFilter, filterOutDrafts } from "./filters";

const OLD_ENV = process.env;

const setToProd = () => {
  jest.resetModules(); // Most important - it clears the cache
  process.env = { ...OLD_ENV }; // Make a copy
  process.env.ACTIVE_ENV = "production";
};

const restoreOldEnvironment = () => {
  process.env = OLD_ENV; // Restore old environment
};

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
    beforeEach(() => {
      setToProd();
    });

    afterAll(() => {
      restoreOldEnvironment();
    });

    // These tests are a bit 'writing the implementation down twice' but it's not worth the effort to get to a higher level of validation
    it("gives a basic filter if there are no other filters", async () => {
      expect(generateFilter()).toEqual({
        fields: { slug: { ne: "" }, prefix: { ne: null }, draft: { ne: true } }
      });
    });

    it("combines the filters if a filter is passed in", async () => {
      expect(generateFilter({ frontmatter: { type: { eq: "cats" } } })).toEqual({
        fields: { slug: { ne: "" }, prefix: { ne: null }, draft: { ne: true } },
        frontmatter: { type: { eq: "cats" } }
      });
    });
  });
});

describe("the node filtering", () => {
  const draft = {
    node: {
      frontmatter: { category: "test-stuff" },
      fields: { source: "posts", slug: "not-yet", prefix: "draft", draft: true }
    }
  };

  const unconventionalDraftPrefix = {
    node: {
      frontmatter: { category: "test-stuff" },
      fields: { source: "posts", slug: "still-not-yet", prefix: "unready2", draft: true }
    }
  };

  // This should perhaps count as a draft but requiring a prefix would add a lot of bulk to the tests, so do not bother
  const noprefix = {
    node: {
      frontmatter: { category: "final-stuff" },
      fields: { source: "posts", slug: "no-prefix" }
    }
  };
  const dated = {
    node: {
      frontmatter: { category: "final-stuff" },
      fields: { source: "posts", slug: "done-now", prefix: "2022-01-17" }
    }
  };

  const anotherDated = {
    node: {
      frontmatter: { category: "cat-stuff" },
      fields: { source: "posts", slug: "perfect", prefix: "1978-10-04" }
    }
  };

  const future = {
    node: {
      frontmatter: { category: "final-stuff" },
      fields: { source: "posts", slug: "done-now", prefix: "2052-01-17" }
    }
  };

  const page = {
    node: {
      frontmatter: { category: "site-furniture" },
      fields: { source: "pages", slug: "about", prefix: "1" }
    }
  };

  const edges = [
    dated,
    draft,
    anotherDated,
    draft,
    noprefix,
    page,
    unconventionalDraftPrefix,
    future
  ];

  describe("in non-production environments", () => {
    it("leaves in normal content", async () => {
      expect(filterOutDrafts(edges)).toContain(dated);
    });

    it("handles empty lists", async () => {
      expect(filterOutDrafts([])).toEqual([]);
    });

    it("leaves in drafts", async () => {
      expect(filterOutDrafts(edges)).toContain(draft);
      expect(filterOutDrafts(edges)).toContain(unconventionalDraftPrefix);
    });

    it("filters out future content if not explicitly included", async () => {
      expect(filterOutDrafts(edges)).not.toContain(future);
    });

    it("leaves in out future content if show future is true", async () => {
      expect(filterOutDrafts(edges, true)).toContain(future);
    });
  });

  describe("in production environments", () => {
    beforeEach(() => {
      setToProd();
    });

    afterAll(() => {
      restoreOldEnvironment();
    });

    it("handles empty lists", async () => {
      expect(filterOutDrafts([])).toEqual([]);
    });

    it("handles empty nodes", async () => {
      expect(filterOutDrafts([{}])).toEqual([{}]);
    });

    it("leaves page furniture even if it does not have a date", async () => {
      expect(filterOutDrafts(edges)).toContain(page);
    });

    it("leaves posts with dates", async () => {
      expect(filterOutDrafts(edges)).toContain(dated);
      expect(filterOutDrafts(edges)).toContain(anotherDated);
    });

    it("strips out posts in the future", async () => {
      const edgesWithFuture = [...edges, future];
      expect(filterOutDrafts(edgesWithFuture)).not.toContain(future);
    });

    it("leaves posts in the future if the option is set", async () => {
      const showFuture = true;
      const edgesWithFuture = [...edges, future];
      expect(filterOutDrafts(edgesWithFuture, showFuture)).toContain(future);
    });

    it("strips out drafts", async () => {
      expect(filterOutDrafts(edges)).not.toContain(draft);
      expect(filterOutDrafts(edges)).not.toContain(unconventionalDraftPrefix);
    });
  });
});

module.exports = { setToProd, restoreOldEnvironment };
