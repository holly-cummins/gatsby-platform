jest.setTimeout(15 * 1000);

validateMediumRedirect = async () => {
  expect(page.url()).toMatch("https://holly-k-cummins.medium.com/");
  await expect(page.waitForXPath('//*[contains(text(), "Holly K Cummins")]')).resolves.toBeTruthy();
};

describe("http", () => {
  describe("root", () => {
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

  describe("www", () => {
    describe("www.hollycummins.com", () => {
      beforeAll(async () => {
        await page.goto("http://www.hollycummins.com");
      });

      it('should be Hollys page"', async () => {
        await validateMediumRedirect();
      });
    });

    describe("www.hollycummins.fun", () => {
      beforeAll(async () => {
        await page.goto("http://www.hollycummins.fun");
      });

      it('should be Hollys page"', async () => {
        await validateMediumRedirect();
      });
    });

    describe("www.hollycummins.dev", () => {
      beforeAll(async () => {
        await page.goto("http://www.hollycummins.dev");
      });

      it('should be Hollys page"', async () => {
        await validateMediumRedirect();
      });
    });
  });
});
