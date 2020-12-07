jest.setTimeout(15 * 1000);

validateMediumRedirect = async () => {
  expect(page.url()).toMatch("https://holly-k-cummins.medium.com/");
  await expect(page.waitForXPath('//*[contains(text(), "Holly K Cummins")]')).resolves.toBeTruthy();
};

validateNoRedirect = async name => {
  await expect(page.url()).toMatch(name);
};

describe("hollycummins.com", () => {
  const domain = "hollycummins.com";
  describe("http", () => {
    describe("apex", () => {
      beforeAll(async () => {
        await page.goto("http://" + domain);
      });

      it('should be Hollys page"', async () => {
        await validateMediumRedirect();
      });
    });

    describe("www", () => {
      beforeAll(async () => {
        await page.goto("http://www." + domain);
      });

      it('should be Hollys page"', async () => {
        await validateMediumRedirect();
      });
    });
  });
});

describe("hollycummins.fun", () => {
  const domain = "hollycummins.fun";
  describe("http", () => {
    describe("apex", () => {
      beforeAll(async () => {
        await page.goto("http://" + domain);
      });

      it('should be Hollys page"', async () => {
        await validateMediumRedirect();
      });
    });

    describe("www", () => {
      beforeAll(async () => {
        await page.goto("http://www." + domain);
      });

      it('should be Hollys page"', async () => {
        await validateMediumRedirect();
      });
    });
  });
});
