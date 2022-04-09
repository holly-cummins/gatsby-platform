jest.setTimeout(15 * 1000);
const urlMetadata = require("url-metadata");

const { port } = require("../jest-puppeteer.config").server;
import { liveUrl } from "../../content/meta/config";

// We don't have a good dynamic way of getting a post, so hardcode for now
const slug = "tech-stack/";
const siteRoot = `http://localhost:${port}/${slug}`;

titleMatcher = /How this site is built/;

describe("a post", () => {
  describe("page contents", () => {
    beforeAll(async () => {
      await page.goto(siteRoot);
    });

    it("should have the title on it somewhere", async () => {
      // Shame we have to hardcode this, but ...
      await expect(page).toMatch(titleMatcher);
    });
  });

  describe("header metadata", () => {
    let metadata;
    beforeAll(async () => {
      metadata = await urlMetadata(siteRoot);
    });

    it("should have an opengraph title", async () => {
      const title = metadata["og:title"];

      expect(title).toBeTruthy();
      // Handle internal and external images, of png or jpg
      expect(title).toMatch(titleMatcher);
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
      expect(description).toMatch(/write.*Blogger/);
    });

    it("should have correct opengraph url", async () => {
      const url = metadata["og:url"];

      expect(url).toBeTruthy();
      expect(url).toBe(`${liveUrl}/${slug}`);
    });

    it("should have a twitter title", async () => {
      const title = metadata["twitter:title"];

      expect(title).toBeTruthy();
      // Handle internal and external images, of png or jpg
      expect(title).toMatch(titleMatcher);
    });

    it("should have a fully qualified twitter image", async () => {
      const imageUrl = metadata["twitter:image"];

      expect(imageUrl).toBeTruthy();
      // Handle internal and external images, of png or jpg
      expect(imageUrl).toMatch(/https?:\/\/.*\/.*(png|jpg)/);
    });

    it("should have a twitter description specific to the article", async () => {
      const description = metadata["og:description"];

      expect(description).toBeTruthy();
      // Unfortunate hardcoding, but ...
      expect(description).toMatch(/write.*Blogger/);
    });

    it("should have correct opengraph url", async () => {
      const url = metadata["og:url"];

      expect(url).toBeTruthy();
      expect(url).toBe(`${liveUrl}/${slug}`);
    });
  });
});
