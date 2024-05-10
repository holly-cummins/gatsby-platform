const { onCreateNode } = require("./gatsby-node");
const { createFilePath } = require(`gatsby-source-filesystem`);

jest.mock(`gatsby-source-filesystem`);

const createNodeField = jest.fn(({ node, name, value }) => {
  node.fields[name] = value;
});

const actions = { createNodeField };

describe("the preprocessor", () => {
  describe("for draft page", () => {
    const fields = {
      prefix: "some-draft"
    };

    const node = {
      fields,
      internal: { type: "MarkdownRemark" }
    };

    beforeAll(async () => {
      createFilePath.mockReturnValue(node.fields.prefix + "--aslug");

      await onCreateNode({ node, actions });
    });

    afterAll(() => {});

    it("does not add a short date", async () => {
      expect(fields.shortDate).toBeUndefined();
    });

    it("adds a draft flag", async () => {
      expect(fields.draft).toBeTruthy();
    });
  });

  describe("for a page with a date prefix", () => {
    const fields = {
      prefix: "2020-07-08"
    };

    const node = {
      fields,
      internal: { type: "MarkdownRemark" }
    };

    beforeAll(async () => {
      createFilePath.mockReturnValue(node.fields.prefix + "--a-description");
      await onCreateNode({ node, actions });
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it("adds a short date", async () => {
      expect(fields.shortDate).toEqual("07-08");
    });

    it("does not add a draft field", async () => {
      expect(fields.draft).toBeUndefined();
    });
  });
});
