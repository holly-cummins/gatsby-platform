const { mutateSource } = require("./index");

// This test relies on a mock in __mocks__. To validate things against
// the real implementation, rename __mocks__/node-geocoder.js to something else temporarily.

describe("the preprocessor", () => {
  describe("for an event with no location", () => {
    const frontmatter = {};

    const page = {
      markdownNode: {
        frontmatter
      }
    };

    beforeAll(async () => {
      await mutateSource(page);
    });

    afterAll(() => {});

    it("changes nothing", async () => {
      expect(page.markdownNode.frontmatter).toEqual({});
    });
  });

  describe("for an event with a city and country", () => {
    const location = "London, UK";
    const frontmatter = {
      location
    };

    const page = {
      markdownNode: {
        frontmatter
      }
    };

    beforeAll(async () => {
      await mutateSource(page);
    });

    afterAll(() => {});

    it("fills in a country name", async () => {
      expect(page.markdownNode.frontmatter.geography.country).toEqual("United Kingdom");
    });

    it("fills in a country code", async () => {
      expect(page.markdownNode.frontmatter.geography.countryCode).toEqual("GB");
    });

    it("adds a flag", async () => {
      const base64Flag = page.markdownNode.frontmatter.geography.flag;
      expect(base64Flag).toMatch(/(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/);
      const flag = atob(base64Flag);
      expect(flag).toMatch(/<svg.*\/>/);
    });
  });

  describe("for an event with a city only", () => {
    const location = "Toronto";
    const frontmatter = {
      location
    };

    const page = {
      markdownNode: {
        frontmatter
      }
    };

    beforeAll(async () => {
      await mutateSource(page);
    });

    afterAll(() => {});

    it("fills in a country name", async () => {
      expect(page.markdownNode.frontmatter.geography.country).toEqual("Canada");
    });

    it("fills in a country code", async () => {
      expect(page.markdownNode.frontmatter.geography.countryCode).toEqual("CA");
    });
  });
});
