jest.setTimeout(15 * 1000);

const validateHollyHomepage = async response => {
  await expect(page.waitForXPath('//*[contains(text(), "IBMer")]')).resolves.toBeTruthy();
};

const validateNoRedirect = async name => {
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
        await validateHollyHomepage();
      });
    });

    describe("www", () => {
      beforeAll(async () => {
        await page.goto("http://www." + domain);
      });

      it('should be Hollys page"', async () => {
        await validateHollyHomepage();
      });

      it("should not redirect to a different domain ", async () => {
        await validateNoRedirect(domain);
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
        await validateHollyHomepage();
      });

      it("should redirect to hollycummins.com", async () => {
        expect(page.url()).toMatch("http://hollycummins.com/");
      });
    });

    describe("www", () => {
      beforeAll(async () => {
        await page.goto("http://www." + domain);
      });

      it('should be Hollys page"', async () => {
        await validateHollyHomepage();
      });
    });
  });
});
