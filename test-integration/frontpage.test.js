jest.setTimeout(15 * 1000);

const { port } = require("../jest-puppeteer.config").server;
const { authorName } = require("../src/utils/configger");

const siteRoot = `http://localhost:${port}`;

describe("main site", () => {
  beforeAll(async () => {
    await page.goto(siteRoot);
  });

  it("should have the author name on it somewhere", async () => {
    await expect(page.waitForXPath(`//*[text()="${authorName}"]`)).resolves.toBeTruthy();
  });

  describe("header navigation bar", () => {
    it("should have a Search option", async () => {
      await expect(page.waitForXPath('//*[text()="Search"]')).resolves.toBeTruthy();
    });

    it("should have a Contact option", async () => {
      await expect(page.waitForXPath('//*[text()="Contact"]')).resolves.toBeTruthy();
    });
  });

  describe("hero mechanism", () => {
    it("should have button to click", async () => {
      await expect(page.waitForXPath('//*[contains(@aria-label,"scroll")]')).resolves.toBeTruthy();
    });

    it("should scroll down when the button is clicked", async () => {
      // Look for a list item which has a class of 'blog-item'
      const selector = '//li[contains(@class, "blog-item")]';

      const tile = await page.waitForXPath(selector);
      // Sense check - make sure the thing is there but not visible (we have to use the viewport, not the css visibility)
      await expect(tile.isIntersectingViewport()).resolves.toBeFalsy();

      const scrollButton = await page.waitForXPath('//*[contains(@aria-label,"scroll")]');
      await expect(scrollButton.isIntersectingViewport()).resolves.toBeTruthy();

      // Click, which should scroll
      await scrollButton.evaluate(scrollButton => scrollButton.click());
      // Nasty hack; wait for some scrolling to happen
      await page.waitFor(1000);
      // Now the button should be out of view
      await expect(scrollButton.isIntersectingViewport()).resolves.toBeFalsy();

      // Now we we should be able to see the tile
      await expect(tile.isIntersectingViewport()).resolves.toBeTruthy();
    });
  });
});
