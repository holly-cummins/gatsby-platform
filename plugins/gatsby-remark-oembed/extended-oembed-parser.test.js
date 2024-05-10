const originalParser = require("oembed-parser");

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
jest.spyOn(originalParser, "extract");
jest.spyOn(originalParser, "setProviderList");

const parser = require("./extended-oembed-parser");

describe("the parser", () => {
  it("adds notist to the list of providers", async () => {
    expect(originalParser.setProviderList.mock.calls.length).toBe(1);
    const newProviderList = originalParser.setProviderList.mock.calls[0][0];
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

  const url = "https://www.youtube.com/watch?v=8jPQjjsBbIc";
  const oembed = { url };

  it("resolves oembed links", async () => {
    await parser.extract(oembed);
    expect(originalParser.extract.mock.calls.length).toBe(1);
  });
});
