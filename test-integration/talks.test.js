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
      const talksLink = await page.waitForXPath('//a[text()="Talks"]');
      talksLink.evaluate(link => link.click());

      // Now it should be the talks page
      await expect(page.waitForXPath('//h1[contains(text(), "talks")]')).resolves.toBeTruthy();
    });
  });

  describe("direct visit to the listings page", () => {
    beforeAll(async () => {
      await page.goto(siteRoot + "/type/talk");
    });

    it("should be a talks page", async () => {
      await expect(page.waitForXPath('//h1[contains(text(), "talks")]')).resolves.toBeTruthy();
    });

    it("should list at least one item", async () => {
      const numberOfPosts = (await page.$$("li.event-list")).length;
      expect(numberOfPosts).toBeGreaterThan(1);
    });

    it("should have flags", async () => {
      const numberOfFlags = (await page.$$("div.flag > svg")).length;
      expect(numberOfFlags).toBeGreaterThan(0);
    });

    it("should have event names", async () => {
      // We don't know the content, but it's a reasonable guess some content matches SomethingCon
      await expect(
        page.waitForXPath('//div[contains(@class,"event")]//*[contains(text(), "Con")]')
      ).resolves.toBeTruthy();
    });

    describe("on hovering over an event name", () => {
      it("should switch event names for short dates", async () => {
        // We don't know the content, but it's a reasonable guess some content matches SomethingCon
        const oldestCon = await page.waitForXPath(
          '//div[contains(@class,"event")]//*[contains(text(), "Con")]'
        );
        oldestCon.hover();
        // Every element should switch to a date

        try {
          // Sadly, we cannot use regex selectors in xpath 1, and selecting for text with css is hard
          // So assume at least one of the dates must contain a 0
          const date = await page.waitForXPath(
            '//div[contains(@class,"event")]//*[contains(text(), "0")]',
            { timeout: 5 * 1000 }
          );
        } catch (e) {
          const main = await page.$("main");
          // Annoyingly this does not have any formatting but I cannot find a more useful output because outerHtml is too busy
          let content = await main.evaluate(el => el.textContent);
          throw new Error("Could not find a short form date. Page content is \n" + content);
        }

        // Now do a deeper validation of the date text; we could check every node, but one is probably sufficient
        const date = await page.waitForXPath(
          '//div[contains(@class,"event")]//*[contains(text(), "0")]',
          { timeout: 5 * 1000 }
        );
        expect(date).toBeTruthy();
        const text = await date.evaluate(el => el.textContent);
        expect(text).toMatch(/[0-9][0-9]-[0-9][0-9]/);
      });
    });
  });
});
