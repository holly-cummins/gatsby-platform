const url = require("url");
const { Client } = require("twitter-api-sdk");
const fs = require("fs/promises");
const fss = require("fs");
const path = require("path");

const defaultOptions = {
  nodeType: "MarkdownRemark"
};

const cacheDir = resolveCacheDir();
const twitterClient = new Client(process.env.BEARER_TOKEN);

exports.onCreateNode = ({ node, getNode, actions }, pluginOptions) => {
  const { createNodeField } = actions;

  const options = {
    ...defaultOptions,
    ...pluginOptions
  };

  if (node.internal.type !== options.nodeType) {
    return;
  }

  if (node.frontmatter.tweets) {
    const enrichedTweets = processTweets(node.frontmatter.tweets);
    createNodeField({
      node,
      name: "tweets",
      value: enrichedTweets
    });
  }
};

const processTweets = async tweets => {
  const enrichedTweets = tweets.map(async tweetUrl => {
    try {
      const parsed = url.parse(tweetUrl);
      const id = parsed.pathname.split("/").pop();

      await cacheTweet(id);

      return { url: tweetUrl, id };
    } catch (e) {
      console.error("Could not process tweet url", tweetUrl, e);
    }
  });
  return enrichedTweets;
};

const cacheTweet = async id => {
  if (!fss.existsSync(getTweetPath())) {
    const stuff = await twitterClient.tweets.findTweetById(
      // Tweet ID
      id,
      {
        // Optional parameters
        expansions: ["author_id"],
        "user.fields": ["created_at", "description", "name"]
      }
    );

    const tweet = stuff.data;
    const author = stuff.includes.users.find(user => (user.id = tweet.author_id));
    tweet.author = author;

    await persistCache(tweet);
    return tweet;
  }
};

const getTweetPath = id => {
  return path.resolve(cacheDir, id + ".json");
};

const persistCache = tweet => {
  return fs.writeFile(getTweetPath(tweet.id), JSON.stringify(tweet, null, " "));
};

// We need to be a bit elaborate here, because we don't want to dump site-specific cache content into the
// generic source, so use the site-specific content directory to hold things
function resolveCacheDir() {
  let contentMetaDir;
  // Use the cache in the external content directory if we have one
  if (fss.existsSync("../content/")) {
    contentMetaDir = "../content/tweets";
  } else {
    contentMetaDir = "./content/tweets";
  }
  if (!fss.existsSync(contentMetaDir)) {
    fss.mkdirSync(contentMetaDir);
  }
  return path.resolve(contentMetaDir);
}
