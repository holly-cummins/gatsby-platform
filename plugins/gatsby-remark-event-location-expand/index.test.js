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

    it("normalises the case", async () => {
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
      expect(page.markdownNode.frontmatter.country).toEqual("United Kingdom");
    });

    it("fills in a country code", async () => {
      expect(page.markdownNode.frontmatter.countryCode).toEqual("GB");
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
      expect(page.markdownNode.frontmatter.country).toEqual("Canada");
    });

    it("fills in a country code", async () => {
      expect(page.markdownNode.frontmatter.countryCode).toEqual("CA");
    });
  });
});
