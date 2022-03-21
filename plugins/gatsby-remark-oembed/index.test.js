const parser = require("oembed-parser");

const oembedResponse = {
  title: "How to while away hours on the internet",
  author_name: "Duckeroo",
  author_url: "https://somewhere",
  type: "video",
  height: 113,
  width: 200,
  version: "1.0",
  provider_name: "YouTube",
  provider_url: "https://www.youtube.com/",
  thumbnail_height: 360,
  thumbnail_width: 480,
  thumbnail_url: "https://i.ytimg.com/vi/8jPQjjsBbIc/hqdefault.jpg",
  html:
    "\u003ciframe width=\u0022200\u0022 height=\u0022113\u0022 src=\u0022https://www.youtube.com/embed/8jPQjjsBbIc?feature=oembed\u0022 frameborder=\u00220\u0022 allow=\u0022accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture\u0022 allowfullscreen\u003e\u003c/iframe\u003e"
};

jest.mock("oembed-parser", () => ({
  extract: () => {
    return new Promise(resolve => {
      resolve(oembedResponse);
    });
  },
  setProviderList: () => {}
}));
jest.spyOn(parser, "extract");
jest.spyOn(parser, "setProviderList");

const { mutateSource } = require("./index");

describe("the preprocessor", () => {
  const oembedTitle = oembedResponse.title;
  const oembedHtml = oembedResponse.html;

  it("adds notist to the list of providers", async () => {
    expect(parser.setProviderList.mock.calls.length).toBe(1);
    const newProviderList = parser.setProviderList.mock.calls[0][0];
    // We should tell the parser about notist
    expect(newProviderList).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          provider_name: "notist"
        })
      ])
    );

    // The parser should still know about youtube
    expect(newProviderList).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          provider_name: "YouTube"
        })
      ])
    );
  });

  describe("for a page with no oembed links", () => {
    const frontmatter = {
      title: "D is For Duck",
      url: "https://www.manning.com/books/d-is-for-duck",
      cover: "d-is-for-duck-abc-1923.png",
      author: "ducky devine",
      category: "quacking",
      type: "book"
    };

    const page = {
      markdownNode: { frontmatter }
    };

    beforeAll(async () => {
      await mutateSource(page);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it("changes nothing", async () => {
      const original = Object.assign({}, page);
      expect(page).toEqual(original);
    });

    it("does not attempt to resolve oembed links", async () => {
      expect(parser.extract).not.toHaveBeenCalled();
    });
  });

  describe("for a page with video oembed links", () => {
    const url = "https://www.youtube.com/watch?v=8jPQjjsBbIc";
    const originalTitle = "D is For Duck";

    const frontmatter = {
      title: originalTitle,
      url: "https://www.manning.com/books/d-is-for-duck",
      cover: "d-is-for-duck-abc-1923.png",
      author: "ducky devine",
      category: "quacking",
      type: "book",
      video: { url }
    };

    const page = {
      markdownNode: { frontmatter }
    };

    beforeAll(async () => {
      await mutateSource(page);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it("resolves oembed links", async () => {
      expect(parser.extract.mock.calls.length).toBe(1);
    });

    it("extracts oembed metadata", async () => {
      expect(frontmatter.video.title).toEqual(oembedTitle);
    });

    it("extracts oembed link", async () => {
      expect(frontmatter.video.html).toEqual(oembedHtml);
    });

    it("does not override the document title", async () => {
      expect(frontmatter.title).toEqual(originalTitle);
    });

    describe("for a page with no title", () => {
      const url = "https://www.youtube.com/watch?v=8jPQjjsBbIc";

      const frontmatter = {
        url: "https://www.manning.com/books/d-is-for-duck",
        cover: "d-is-for-duck-abc-1923.png",
        author: "ducky devine",
        category: "quacking",
        type: "book",
        video: { url }
      };

      const page = {
        markdownNode: { frontmatter }
      };

      beforeAll(async () => {
        await mutateSource(page);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it("extracts oembed metadata", async () => {
        expect(frontmatter.video.title).toEqual(oembedTitle);
      });

      it("extracts oembed link", async () => {
        expect(frontmatter.video.html).toEqual(oembedHtml);
      });

      it("sets a document title", async () => {
        expect(frontmatter.title).toEqual(oembedTitle);
      });
    });
  });

  describe("for a page with slide oembed links", () => {
    const url = "https://speakerdeck.com/tanoku/ruby-is-unlike-a-banana";
    const originalTitle = "D is For Duck";

    const frontmatter = {
      title: originalTitle,
      url: "https://www.manning.com/books/d-is-for-duck",
      cover: "d-is-for-duck-abc-1923.png",
      author: "ducky devine",
      category: "quacking",
      type: "book",
      slides: { url }
    };

    const page = {
      markdownNode: { frontmatter }
    };

    beforeAll(async () => {
      await mutateSource(page);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it("resolves oembed links", async () => {
      expect(parser.extract.mock.calls.length).toBe(1);
    });

    it("extracts oembed metadata", async () => {
      expect(frontmatter.slides.title).toEqual(oembedTitle);
    });

    it("extracts oembed link", async () => {
      expect(frontmatter.slides.html).toEqual(oembedHtml);
    });

    it("does not override the document title", async () => {
      expect(frontmatter.title).toEqual(originalTitle);
    });
  });
});
