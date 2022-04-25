const { mutateSource } = require("./index");
const { cloneDeep } = require("lodash");

describe("the preprocessor", () => {
  describe("for draft page", () => {
    const fields = {
      prefix: "some-draft"
    };

    const page = {
      markdownNode: {
        fields
      }
    };

    const original = cloneDeep(page);

    beforeAll(async () => {
      await mutateSource(page);
    });

    afterAll(() => {});

    it("changes nothing", async () => {
      expect(page).toEqual(original);
    });
  });

  describe("for a page with a date prefix", () => {
    const fields = {
      prefix: "2020-07-08"
    };

    const page = {
      markdownNode: {
        fields
      }
    };

    beforeAll(async () => {
      await mutateSource(page);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it("adds a short date", async () => {
      expect(fields.shortDate).toEqual("07-08");
    });
  });
});
