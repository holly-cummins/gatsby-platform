jest.setTimeout(15 * 1000);

const { port } = require("../jest-puppeteer.config").server;

const siteRoot = `http://localhost:${port}`;

describe("hollycummins.com", () => {
  beforeAll(async () => {
    await page.goto(siteRoot);
  });
  it("should have Hollys name on it somewhere", async () => {
    await expect(page.waitForXPath('//*[text()="Holly Cummins"]')).resolves.toBeTruthy();
  });

  it("should have a Search option", async () => {
    await expect(page.waitForXPath('//*[text()="Search"]')).resolves.toBeTruthy();
  });

  it("should have a Contact option", async () => {
    await expect(page.waitForXPath('//*[text()="Contact"]')).resolves.toBeTruthy();
  });
});
