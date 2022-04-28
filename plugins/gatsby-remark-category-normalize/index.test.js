const { mutateSource } = require("./index");

describe("the preprocessor", () => {
  describe("for a topic with strange casing", () => {
    const category = "CamELpluS";
    const frontmatter = {
      category
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

    it("normalises the case", async () => {
      expect(page.markdownNode.frontmatter.category).toEqual("camelplus");
    });

    it("stashes away the original", async () => {
      expect(page.markdownNode.frontmatter.displayCategory).toEqual(category);
    });
  });
});
