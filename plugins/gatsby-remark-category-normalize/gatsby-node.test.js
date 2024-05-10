const { onCreateNode } = require("./gatsby-node");

const createNodeField = jest.fn(({ node, name, value }) => {
  node.fields[name] = value;
});

const actions = { createNodeField };

describe("the preprocessor", () => {
  describe("for a topic with strange casing", () => {
    const category = "CamELpluS";

    const fields = {};
    const frontmatter = {
      category
    };

    const node = {
      fields,
      frontmatter,
      internal: { type: "MarkdownRemark" }
    };

    beforeAll(async () => {
      await onCreateNode({ node, actions });
    });

    afterAll(() => {});

    it("normalises the case", async () => {
      expect(fields.category).toEqual("camelplus");
    });

    it("stashes away the original", async () => {
      expect(fields.displayCategory).toEqual(category);
    });
  });

  describe("for a topic with spaces", () => {
    const category = "with some Spaces";

    const fields = {};
    const frontmatter = {
      category
    };

    const node = {
      fields,
      frontmatter,
      internal: { type: "MarkdownRemark" }
    };

    beforeAll(async () => {
      await onCreateNode({ node, actions });
    });

    afterAll(() => {});

    it("normalises the case", async () => {
      expect(fields.category).toEqual("with-some-spaces");
    });

    it("stashes away the original", async () => {
      expect(fields.displayCategory).toEqual(category);
    });
  });
});
