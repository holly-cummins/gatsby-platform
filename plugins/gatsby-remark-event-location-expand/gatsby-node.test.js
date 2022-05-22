const { onCreateNode } = require("./gatsby-node");

// This test relies on a mock in __mocks__. To validate things against
// the real implementation, rename __mocks__/node-geocoder.js to something else temporarily.

const createNodeField = jest.fn(({ node, name, value }) => {
  node.fields[name] = value;
});
const actions = { createNodeField };
const internal = { type: "MarkdownRemark" };

describe("the preprocessor", () => {
  describe("for an event with no location", () => {
    const frontmatter = {};
    const fields = {};

    const node = {
      frontmatter,
      fields,
      internal
    };

    beforeAll(async () => {
      await onCreateNode({ node, actions });
    });

    afterAll(() => {});

    it("changes nothing", async () => {
      expect(node.fields).toEqual({});
    });
  });

  describe("for an event with a city and country", () => {
    const location = "London, UK";
    const fields = {};
    const frontmatter = {
      location
    };

    const node = {
      frontmatter,
      fields,
      internal
    };

    beforeAll(async () => {
      await onCreateNode({ node, actions });
    });

    afterAll(() => {});

    it("fills in a country name", async () => {
      expect(node.fields.geography.country).toEqual("United Kingdom");
    });

    it("fills in a country code", async () => {
      expect(node.fields.geography.countryCode).toEqual("GB");
    });

    it("adds a flag", async () => {
      const base64Flag = node.fields.geography.flag;
      expect(base64Flag).toMatch(/(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/);
      const flag = atob(base64Flag);
      expect(flag).toMatch(/<svg.*\/>/);
    });
  });

  describe("for an event with a city only", () => {
    const location = "Toronto";
    const fields = {};
    const frontmatter = {
      location
    };

    const node = {
      frontmatter,
      fields,
      internal
    };

    beforeAll(async () => {
      await onCreateNode({ node, actions });
    });

    afterAll(() => {});

    it("fills in a country name", async () => {
      expect(node.fields.geography.country).toEqual("Canada");
    });

    it("fills in a country code", async () => {
      expect(node.fields.geography.countryCode).toEqual("CA");
    });
  });
});
