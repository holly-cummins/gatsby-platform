jest.setTimeout(15 * 1000);

const { port } = require("../jest-puppeteer.config").server;

const siteRoot = `http://localhost:${port}`;

describe("categories page", () => {
  describe("navigating to the categories", () => {
    beforeAll(async () => {
      await page.goto(siteRoot);
    });

    it("should be possible from the front page", async () => {
      await expect(page.waitForSelector("xpath/ //*[text()=\"Topics\"]")).resolves.toBeTruthy();
    });

    it("should bring up a categories page", async () => {
      const link = await page.waitForSelector("xpath/ //a[text()=\"Topics\"]");
      link.evaluate(link => link.click());

      // Now it should be the categories page
      await expect(
        page.waitForSelector("xpath/ //h1[contains(text(), \"Thinking About?\")]")
      ).resolves.toBeTruthy();
    });
  });

  describe("direct visit to the summary page", () => {
    beforeAll(async () => {
      await page.goto(siteRoot + "/category/");
    });

    it("should be a categories page", async () => {
      await expect(
        page.waitForSelector("xpath/ //h1[contains(text(), \"Thinking About?\")]")
      ).resolves.toBeTruthy();
    });

    it("should list at least one item", async () => {
      const numberOfPosts = (await page.$$("li.post-list")).length;
      expect(numberOfPosts).toBeGreaterThan(2);
    });
  });

  // TODO test the individual pages too
});
