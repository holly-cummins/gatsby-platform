jest.setTimeout(15 * 1000);
const { setTimeout } = require("node:timers/promises");

const { port } = require("../jest-puppeteer.config").server;
const { authorName } = require("../src/utils/configger");

const siteRoot = `http://localhost:${port}`;

// eslint-disable-next-line jest/expect-expect,jest/valid-title,jest/no-disabled-tests
const itSometimes = (condition, ...args) => (condition ? test(...args) : test.skip(...args));

describe("main site", () => {
  beforeAll(async () => {
    await page.goto(siteRoot);
  });

  it("should have the author name on it somewhere", async () => {
    await expect(page.waitForSelector(`xpath/ //*[text()="${authorName}"]`)).resolves.toBeTruthy();
  });

  it("should have the author name on it attached to the metadata for an entry", async () => {
    await expect(
      page.waitForSelector(`xpath/ //p[contains(@class, "meta")]/*[text()="${authorName}"]`)
    ).resolves.toBeTruthy();
  });

  describe("header navigation bar", () => {
    itSometimes(
      process.env.ALGOLIA_APP_ID && process.env.ALGOLIA_APP_ID !== "none",
      "should have a Search option",
      async () => {
        // We should only have a search bar if we have algolia configured
        // eslint-disable-next-line jest/no-standalone-expect
        await expect(page.waitForSelector('xpath/ //*[text()="Search"]')).resolves.toBeTruthy();
      }
    );

    it("should have a Contact option", async () => {
      await expect(page.waitForSelector('xpath/ //*[text()="Contact"]')).resolves.toBeTruthy();
    });
  });

  describe("hero mechanism", () => {
    it("should have button to click", async () => {
      await expect(
        page.waitForSelector('xpath/ //*[contains(@aria-label,"scroll")]')
      ).resolves.toBeTruthy();
    });

    it("should scroll down when the button is clicked", async () => {
      // Look for a list item which has a class of 'blog-item'
      const selector = '//li[contains(@class, "blog-item")]';

      const tile = await page.waitForSelector("xpath/" + selector);
      // Sense check - make sure the thing is there but not visible (we have to use the viewport, not the css visibility)
      await expect(tile.isIntersectingViewport()).resolves.toBeFalsy();

      const scrollButton = await page.waitForSelector('xpath/ //*[contains(@aria-label,"scroll")]');
      await expect(scrollButton.isIntersectingViewport()).resolves.toBeTruthy();

      // Click, which should scroll
      await scrollButton.evaluate(but => but.click());
      // Nasty hack; wait for some scrolling to happen
      await setTimeout(2000);

      // Now the button should be out of view
      await expect(scrollButton.isIntersectingViewport()).resolves.toBeFalsy();

      // Now we we should be able to see the tile
      await expect(tile.isIntersectingViewport()).resolves.toBeTruthy();
    });
  });
});
