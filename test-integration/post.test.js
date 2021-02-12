jest.setTimeout(15 * 1000);
const urlMetadata = require("url-metadata");

const { port } = require("../jest-puppeteer.config").server;

// We don't have a good dynamic way of getting a post, so hardcode for now
const slug = "microphone-face-off/";
const siteRoot = `http://localhost:${port}/${slug}`;
const liveUrl = "http://hollycummins.com";

describe("a post", () => {
  describe("page contents", () => {
    beforeAll(async () => {
      await page.goto(siteRoot);
    });

    it("should have the title on it somewhere", async () => {
      // Shame we have to hardcode this, but ...
      await expect(page).toMatch("The great microphone face-off");
    });
  });

  describe("header metadata", () => {
    let metadata;
    beforeAll(async () => {
      metadata = await urlMetadata(siteRoot);
    });
    it("should have an opengraph image", async () => {
      const imageUrl = metadata["og:image"];

      expect(imageUrl).toBeTruthy();
      // Handle internal and external images, of png or jpg
      expect(imageUrl).toMatch(/(http:\/\/|static\/).*(png|jpg)/);
    });

    it("should have an opengraph description specific to the article", async () => {
      const description = metadata["og:description"];

      expect(description).toBeTruthy();
      // Unfortunate hardcoding, but ...
      expect(description).toMatch(/The past year saw an unprecedented flourishing/);
    });

    it("should have correct opengraph url", async () => {
      const url = metadata["og:url"];

      expect(url).toBeTruthy();
      expect(url).toBe(`${liveUrl}/${slug}`);
    });
  });
});
