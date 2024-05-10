const { onCreateNode } = require("./gatsby-node");

const createNodeField = jest.fn(({ node, name, value }) => {
  node.fields[name] = value;
});

const actions = { createNodeField };

describe("the author defaulter", () => {
  describe("for a node with an existing author", () => {
    const author = "Someone and Their Friend";

    const fields = {};
    const frontmatter = {
      author
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

    it("leaves the original", async () => {
      expect(frontmatter.author).toEqual(author);
    });

    it("copies the author to the fields", async () => {
      expect(fields.author).toEqual(author);
    });
  });

  describe("for a node with no author", () => {
    // We don't know which name will be used because the config looks in a few places,
    // but as long as we get something that looks like a person's name we are happy
    const authorRegex = /[A-Z][a-z]* [A-Z][a-z]*/;

    const fields = {};
    const frontmatter = {};

    const node = {
      fields,
      frontmatter,
      internal: { type: "MarkdownRemark" }
    };

    beforeAll(async () => {
      await onCreateNode({ node, actions });
    });

    afterAll(() => {});

    it("does not change the frontmatter", async () => {
      expect(frontmatter).toEqual({});
    });

    it("copies the configured site author to the fields", async () => {
      expect(fields.author).toMatch(authorRegex);
    });
  });
});
