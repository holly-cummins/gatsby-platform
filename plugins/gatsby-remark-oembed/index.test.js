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
  }
}));
jest.spyOn(parser, "extract");

const { mutateSource } = require("./index");

describe("the preprocessor", () => {
  const videoTitle = oembedResponse.title;
  const videoHtml = oembedResponse.html;

  beforeAll(async () => {
    beforeAll(async () => {
      await mutateSource(page);
    });
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

  describe("for a page with oembed links", () => {
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
      expect(frontmatter.video.title).toEqual(videoTitle);
    });

    it("extracts oembed link", async () => {
      expect(frontmatter.video.html).toEqual(videoHtml);
    });

    it("does not override the document title", async () => {
      expect(frontmatter.title).toEqual(originalTitle);
    });
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

    it("resolves oembed links", async () => {
      expect(parser.extract.mock.calls.length).toBe(1);
    });

    it("extracts oembed metadata", async () => {
      expect(frontmatter.video.title).toEqual(videoTitle);
    });

    it("extracts oembed link", async () => {
      expect(frontmatter.video.html).toEqual(videoHtml);
    });

    it("sets a document title", async () => {
      expect(frontmatter.title).toEqual(videoTitle);
    });
  });
});
