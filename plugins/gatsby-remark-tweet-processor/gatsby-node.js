const url = require("url");
const axios = require("axios");
const { Client } = require("twitter-api-sdk");
const fs = require("fs/promises");
const fss = require("fs");
const path = require("path");
const promiseRetry = require("promise-retry");

const defaultOptions = {
  nodeType: "MarkdownRemark"
};

const twitterClient = new Client(process.env.BEARER_TOKEN);

exports.onCreateNode = async ({ node, getNode, actions }, pluginOptions) => {
  const { createNodeField } = actions;

  const options = {
    ...defaultOptions,
    ...pluginOptions
  };

  if (node.internal.type !== options.nodeType) {
    return;
  }

  if (node.frontmatter.tweets) {
    const cacheDir = resolveCacheDir(node);

    const enrichedTweets = await processTweets(node.frontmatter.tweets, cacheDir);

    return createNodeField({
      node,
      name: "tweets",
      value: enrichedTweets
    });
  }
};

const processTweets = async (tweets, cacheDir) => {
  const enrichedTweets = tweets.map(async tweetUrl => {
    if (tweetUrl) {
      const parsed = url.parse(tweetUrl);
      const id = parsed.pathname.split("/").pop();

      return cacheTweet(id, cacheDir)
        .then(() => {
          return { url: tweetUrl, id };
        })
        .catch(e => {
          if (e.status === 429) {
            console.error("Hit rate limiter for ", url);
          } else {
            console.error("Could not process tweet url", tweetUrl, e);
          }
          return {};
        });
    }
  });
  return Promise.all(enrichedTweets);
};

const cacheTweet = async (id, cacheDir) => {
  const tweetPath = getTweetPath(id, cacheDir);
  if (!fss.existsSync(tweetPath)) {
    console.log("Could not find tweet locally, so downloading. Looked for ", tweetPath);
    const fetchTweet = () =>
      twitterClient.tweets.findTweetById(
        // Tweet ID
        id,
        {
          // Optional parameters
          expansions: ["author_id", "attachments.media_keys"],
          "user.fields": ["created_at", "description", "name", "profile_image_url"],
          "media.fields": ["preview_image_url", "url"]
        }
      );

    const fetchedTweet = await promiseRetry(fetchTweet, {
      retries: 4,
      minTimeout: 20 * 1000,
      factor: 8
    });

    // We have a weakness where if we have cached the tweet json, we assume all images were also successfully downloaded
    // We can catch that later on and fail then
    return downloadAllImages(id, fetchedTweet, cacheDir);
  }
};

const downloadAllImages = async (id, fetchedTweet, cacheDir) => {
  const tweet = fetchedTweet.data;
  if (tweet) {
    tweet.author = fetchedTweet?.includes?.users.find(user => (user.id = tweet.author_id));

    const images = fetchedTweet?.includes?.media
      ? fetchedTweet.includes.media.map(
          async media =>
            await promiseRetry(
              async () => {
                const imageUrl = media.url;
                return await downloadImage(imageUrl, cacheDir);
              },
              { retries: 4, secTimeout: 20 * 1000 }
            )
        )
      : [];

    if (tweet.author.profile_image_url) {
      tweet.author.imagePath = await promiseRetry(
        async () => {
          const imageUrl = tweet.author.profile_image_url;
          return await downloadImage(imageUrl, cacheDir);
        },
        { retries: 4, secTimeout: 10 * 1000 }
      );
    }

    return Promise.all(images)
      .then(resolvedImages => (tweet.images = resolvedImages))
      .then(() => persistCache(tweet, cacheDir));
  } else {
    throw new Error("Could not fetch " + id + ". Has the tweet been deleted?");
  }
};

const downloadImage = async (imageUrl, cacheDir) => {
  if (imageUrl) {
    const basename = imageUrl.split("/").pop();
    const file = path.resolve(cacheDir, basename);

    return promiseRetry(
      async () => {
        const response = await axios.get(imageUrl, {
          responseType: "stream"
        });

        return new Promise(resolve => {
          const w = response?.data?.pipe(fss.createWriteStream(file));
          w?.on("finish", () => {
            resolve(basename);
          });
        });
      },
      {
        retries: 4,
        secTimeout: 10 * 1000
      }
    );
  }
};

const getTweetPath = (id, cacheDir) => {
  return path.resolve(cacheDir, id + ".json");
};

const persistCache = (tweet, cacheDir) => {
  return fs.writeFile(getTweetPath(tweet.id, cacheDir), JSON.stringify(tweet, null, " "));
};

// We store tweets in the folder of the referencing markdown file
function resolveCacheDir(node) {
  const contentMetaDir = path.resolve(node.fileAbsolutePath, "..", "tweets");
  if (!fss.existsSync(contentMetaDir)) {
    fss.mkdirSync(contentMetaDir);
  }
  return contentMetaDir;
}
