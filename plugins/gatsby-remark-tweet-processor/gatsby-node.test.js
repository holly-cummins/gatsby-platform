const twitter = require("twitter-api-sdk");
const fss = require("fs");
const fs = require("fs/promises");

jest.mock("twitter-api-sdk");
jest.mock("fs");
jest.mock("fs/promises");

// For this test, the return needs to be syntactically ok but otherwise content does not matter
const tweet1234 = {
  data: {
    author_id: "20",
    edit_history_tweet_ids: ["678"],
    id: "678",
    text: "on way to work"
  },
  includes: { users: [{ author: { id: "6" } }] }
};

const tweetsApi = {
  tweets: {
    findTweetById: jest.fn().mockReturnValue(tweet1234)
  }
};
twitter.Client.mockImplementation(() => tweetsApi);

const { onCreateNode } = require("./gatsby-node");

fss.existsSync = jest.fn();
// Return value is irrelevant here, but we want to return a promise
fs.writeFile = jest.fn().mockResolvedValue("fine");

const createNodeField = jest.fn(({ node, name, value }) => {
  node.fields[name] = value;
});

const actions = { createNodeField };

describe("the tweet preprocessor", () => {
  describe("for a page with no tweets", () => {
    const fields = {};
    const node = {
      fields,
      frontmatter: {},
      internal: { type: "MarkdownRemark" }
    };

    beforeAll(async () => {
      await onCreateNode({ node, actions });
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it("handles the empty data gracefully", async () => {
      expect(fields).toBeTruthy();
    });
  });

  describe("for a page with tweets that have already been cached", () => {
    const fields = {};

    const tweets = [
      "https://twitter.com/unknown/status/1234",
      "https://twitter.com/holly_cummins/status/1463554177200795657?s=20&t=e7RitQgCxLVuM-q0EzjoiQ"
    ];

    const node = {
      fields,
      frontmatter: { tweets },
      internal: { type: "MarkdownRemark" }
    };

    beforeAll(async () => {
      fss.existsSync = jest.fn().mockReturnValue(true);

      await onCreateNode({ node, actions });
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it("does not invoke the twitter api", async () => {
      expect(tweetsApi.tweets.findTweetById).not.toHaveBeenCalled();
    });

    it("processes tweets", () => {
      expect(fields.tweets).toHaveLength(2);
    });

    it("extracts the id for a simple url", async () => {
      expect(fields.tweets[0].id).toEqual("1234");
    });

    it("extracts the id for a complex url with query parameters", async () => {
      expect(fields.tweets[1].id).toEqual("1463554177200795657");
    });

    it("retains the url", () => {
      expect(fields.tweets[0].url).toEqual("https://twitter.com/unknown/status/1234");
    });
  });

  describe("for a page with tweets that do not exist locally", () => {
    const fields = {};

    const tweets = [
      "https://twitter.com/unknown/status/42",
      "https://twitter.com/holly_cummins/status/678"
    ];

    const node = {
      fields,
      frontmatter: { tweets },
      internal: { type: "MarkdownRemark" }
    };

    beforeAll(async () => {
      fss.existsSync = jest.fn().mockReturnValue(false);

      await onCreateNode({ node, actions });
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it("invokes the twitter api", async () => {
      expect(tweetsApi.tweets.findTweetById).toHaveBeenCalled();
    });

    it("saves the tweet to disk", () => {
      expect(fs.writeFile).toHaveBeenCalled();
    });

    it("processes tweets", () => {
      expect(fields.tweets).toHaveLength(2);
    });

    it("extracts the id for a simple url", () => {
      expect(fields.tweets[0].id).toEqual("42");
    });

    it("retains the url for a simple url", () => {
      expect(fields.tweets[0].url).toEqual("https://twitter.com/unknown/status/42");
    });

    it("extracts the id for a complex url with query parameters", () => {
      expect(fields.tweets[1].id).toEqual("678");
    });
  });
});
