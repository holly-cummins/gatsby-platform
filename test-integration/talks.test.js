jest.setTimeout(15 * 1000);

// The talks page is particularly problematic in the built version, so test some of those aspects here
const { port } = require("../jest-puppeteer.config").server;

const siteRoot = `http://localhost:${port}`;

describe("main site", () => {
  describe("navigating to the talks", () => {
    beforeAll(async () => {
      await page.goto(siteRoot);
    });

    it("should be possible from the front page", async () => {
      await expect(page.waitForXPath('//*[text()="Talks"]')).resolves.toBeTruthy();
    });

    it("should bring up a talks page", async () => {
      const link = await page.waitForXPath('//a[text()="Topics"]');
      link.evaluate(link => link.click());

      // Now it should be the talks page
      await expect(page.waitForXPath('//h1[contains(text(), "Talks")]')).resolves.toBeTruthy();
    });
  });

  describe("direct visit to the listings page", () => {
    beforeAll(async () => {
      await page.goto(siteRoot + "/type/talk");
    });

    it("should be a talks page", async () => {
      await expect(page.waitForXPath('//h1[contains(text(), "Talks")]')).resolves.toBeTruthy();
    });

    it("should list at least one item", async () => {
      const numberOfPosts = (await page.$$("li.post-list")).length;
      expect(numberOfPosts).toBeGreaterThan(2);
    });
  });
});
