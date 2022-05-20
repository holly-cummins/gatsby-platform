const os = require("os");
const path = require("path");
const parser = require("./extended-oembed-parser");
const fs = require("fs-extra");

const createNodeField = jest.fn(({ node, name, value }) => {
  node.fields[name] = value;
});

const actions = { createNodeField };

const internal = { type: "MarkdownRemark" };

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
  thumbnail_url: "https://i.ytimg.com/vi/8jPQjjsBbIc/thumbnail.jpg",
  html:
    "\u003ciframe width=\u0022200\u0022 height=\u0022113\u0022 src=\u0022https://www.youtube.com/embed/8jPQjjsBbIc?feature=oembed\u0022 frameborder=\u00220\u0022 allow=\u0022accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture\u0022 allowfullscreen\u003e\u003c/iframe\u003e"
};

jest.mock("./extended-oembed-parser", () => ({
  extract: () => {
    return new Promise(resolve => {
      resolve(oembedResponse);
    });
  },
  hasProvider: () => true
}));
jest.spyOn(parser, "extract");

const { onCreateNode } = require("./gatsby-node");

const postPath = path.join(os.tmpdir(), "somepost");
const fileAbsolutePath = path.join(postPath, "index.md");

describe("the oembed preprocessor", () => {
  const oembedTitle = oembedResponse.title;
  const oembedHtml = oembedResponse.html;

  describe("for a page with no oembed links and no cover", () => {
    describe("with an existing cover", () => {
      const originalTitle = "Q is For Croak";

      const frontmatter = {
        title: originalTitle,
        url: "https://www.manning.com/books/q-is-for-croak",
        cover: "q-is-for-croak-abc-1923.png",
        author: "lucia laryngitis",
        category: "croaking",
        type: "book"
      };

      const fields = {};

      const node = {
        frontmatter,
        fields,
        fileAbsolutePath,
        internal
      };

      beforeAll(async () => {
        await fs.ensureDir(postPath);
        await onCreateNode({ node, actions });
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it("propagates the title upwards", async () => {
        expect(node.fields.title).toEqual(originalTitle);
      });

      it("does not attempt to resolve oembed links", async () => {
        expect(parser.extract).not.toHaveBeenCalled();
      });
    });

    describe("with no cover", () => {
      const originalTitle = "Q is For Croak";

      const frontmatter = {
        title: originalTitle,
        url: "https://www.manning.com/books/q-is-for-croak",
        author: "lucia laryngitis",
        category: "croaking",
        type: "book"
      };

      const fields = {};

      const node = {
        frontmatter,
        fields,
        fileAbsolutePath,
        internal
      };

      beforeAll(async () => {
        await fs.ensureDir(postPath);
        await onCreateNode({ node, actions });
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it("adds a cover", async () => {
        expect(node.fields.cover).toEqual("../../images/placeholder.png");
      });

      it("does not attempt to resolve oembed links", async () => {
        expect(parser.extract).not.toHaveBeenCalled();
      });
    });
  });

  describe("for a page with video oembed links", () => {
    const url = "https://www.youtube.com/watch?v=8jPQjjsBbIc";
    const originalTitle = "Q is For Croak";

    const fields = {};

    const frontmatter = {
      title: originalTitle,
      url: "https://www.manning.com/books/q-is-for-croak",
      cover: "q-is-for-croak-abc-1923.png",
      author: "lucia laryngitis",
      category: "croaking",
      type: "book",
      video: { url }
    };

    const node = {
      frontmatter,
      fields,
      fileAbsolutePath,
      internal
    };

    beforeAll(async () => {
      await fs.ensureDir(postPath);
      await onCreateNode({ node, actions });
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it("resolves oembed links", async () => {
      expect(parser.extract.mock.calls.length).toBe(1);
    });

    it("extracts oembed metadata", async () => {
      expect(fields.video.title).toEqual(oembedTitle);
    });

    it("extracts oembed link", async () => {
      expect(fields.video.html).toEqual(oembedHtml);
    });

    it("does not override the document title", async () => {
      expect(fields.title).toEqual(originalTitle);
    });
  });

  describe("for a page with no title", () => {
    const url = "https://www.youtube.com/watch?v=8jPQjjsBbIc";

    const frontmatter = {
      url: "https://www.manning.com/books/q-is-for-croak",
      cover: "q-is-for-croak-abc-1923.png",
      author: "lucia laryngitis",
      category: "croaking",
      type: "book",
      video: { url }
    };
    const fields = {};

    const node = {
      frontmatter,
      fields,
      fileAbsolutePath,
      internal
    };

    beforeAll(async () => {
      await fs.ensureDir(postPath);
      await onCreateNode({ node, actions });
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it("extracts oembed metadata", async () => {
      expect(fields.video.title).toEqual(oembedTitle);
    });

    it("extracts oembed link", async () => {
      expect(fields.video.html).toEqual(oembedHtml);
    });

    it("sets a document title", async () => {
      expect(fields.title).toEqual(oembedTitle);
    });
  });

  describe("for a page with slide oembed links", () => {
    const url = "https://speakerdeck.com/tanoku/ruby-is-unlike-a-banana";
    const originalTitle = "D is For Duck";

    const fields = {};

    const frontmatter = {
      title: originalTitle,
      url: "https://www.manning.com/books/q-is-for-croak",
      cover: "q-is-for-croak-abc-1923.png",
      author: "lucia laryngitis",
      category: "croaking",
      type: "book",
      slides: { url }
    };

    const node = {
      frontmatter,
      fields,
      fileAbsolutePath,
      internal
    };

    beforeAll(async () => {
      await fs.ensureDir(postPath);
      await onCreateNode({ node, actions });
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
      expect(fields.title).toEqual(originalTitle);
    });
  });
});
