validateMediumRedirect = async () => {
  expect(page.url()).toMatch("https://holly-k-cummins.medium.com/");
  expect(page.waitForXPath('//*[contains(text(), "Holly K Cummins")]')).resolves.toBeTruthy();
};

describe("http", () => {
  describe("hollycummins.com", () => {
    beforeAll(async () => {
      await page.goto("http://hollycummins.com");
    });

    it('should be Hollys page"', async () => {
      await validateMediumRedirect();
    });
  });

  describe("hollycummins.fun", () => {
    beforeAll(async () => {
      await page.goto("http://hollycummins.fun");
    });

    it('should be Hollys page"', async () => {
      await validateMediumRedirect();
    });
  });

  describe("hollycummins.dev", () => {
    beforeAll(async () => {
      await page.goto("http://hollycummins.dev");
    });

    it('should be Hollys page"', async () => {
      await validateMediumRedirect();
    });
  });
});
