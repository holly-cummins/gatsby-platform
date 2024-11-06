jest.setTimeout(15 * 1000);

const { port } = require("../jest-puppeteer.config").server;

const siteRoot = `http://localhost:${port}`;

describe("contact page", () => {
  describe("navigating to the contact page", () => {
    beforeAll(async () => {
      await page.goto(siteRoot);
    });

    it("should be possible from the front page", async () => {
      await expect(page.waitForSelector("xpath/ //*[text()=\"Contact\"]")).resolves.toBeTruthy();
    });

    it("should bring up a categories page", async () => {
      const link = await page.waitForSelector("xpath/ //a[text()=\"Contact\"]");
      link.evaluate(link => link.click());

      // Now it should be the categories page
      await expect(
        page.waitForSelector("xpath/ //h1[contains(text(), \"Contact\")]")
      ).resolves.toBeTruthy();
    });
  });

  describe("direct visit to the contact page", () => {
    beforeAll(async () => {
      await page.goto(siteRoot + "/contact/");
    });

    it("should be a contact page", async () => {
      await expect(
        page.waitForSelector("xpath/ //h1[contains(text(), \"Contact\")]")
      ).resolves.toBeTruthy();
    });

    it("should list at least one item", async () => {
      const numberOfCoordinates = (await page.$$("li.social-coordinate")).length;
      expect(numberOfCoordinates).toBeGreaterThan(2);
    });
  });
});
