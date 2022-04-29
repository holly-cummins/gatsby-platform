jest.setTimeout(5 * 60 * 1000);

const link = require("linkinator");
const { curly } = require("node-libcurl");
const promiseRetry = require("promise-retry");

describe("site links", () => {
  const deadExternalLinks = [];
  const deadInternalLinks = [];

  beforeAll(async () => {
    const path = "http://localhost:9000";

    // create a new `LinkChecker` that we'll use to run the scan.
    const checker = new link.LinkChecker();

    // After a page is scanned, check out the results!
    checker.on("link", async result => {
      if (result.state === "BROKEN") {
        let retryWorked;

        if (result.url.includes("twitter")) {
          console.log("Retrying ", result.url);
          // Twitter gives 404s, I think if it feels bombarded, so let's try a retry
          retryWorked = await retryUrl(result.url);
        }
        if (!retryWorked) {
          const errorText = result.failureDetails[0].statusText || result.failureDetails[0].code;
          const description = `${result.url} => ${result.status} (${errorText}) on ${result.parent}`;
          if (result.url.includes(path)) {
            // This will still miss links where the platform uses the configured url to make it an absolute path, but hopefully we don't care
            // too much about the categorisation as long as *a* break happens
            if (!deadInternalLinks.includes(description)) {
              deadInternalLinks.push(description);
            }
          } else {
            if (!deadExternalLinks.includes(description)) {
              deadExternalLinks.push(description);
            }
          }
        }
      }
    });

    const linksToSkip = [
      "https://twitter.com/ducky_devine",
      "https://www.linkedin.com/in/ducky-devine/",
      "https://www.linkedin.com/in/holly-k-cummins/",
      "https://www.manning.com/books/d-is-for-duck", // known 404, DO NOT SEARCH AND REPLACE
      "https://github.com/ducky-devine", // known 404, DO NOT SEARCH AND REPLACE
      "https://ducky-devine.medium.com", // known 404, DO NOT SEARCH AND REPLACE
      "https://www.manning.com/books/enterprise-osgi-in-action",
      "https://www.klarkteknik.com/product.html?modelCode=P0DPA",
      "https://www.cnbc.com/2016/05/03/this-blind-man-is-running-a-155-mile-ultra-marathon-with-the-help-of-an-ibm-app.html",
      "http://www.element14.com/community/thread/26532/l/quick-start-of-pcduino-without-a-hdmi-monitor-and-serial-debug-cable?displayFullThread=true"
    ]; // We know these links are good and we want to not hit the rate limiters since they appear everywhere
    // Manning and KlarkTeknik seem to have a bot-blocker, which is annoying, since the link seems likely to break
    // NOTE: The Manning, Medium, and github D is For Duck is fictitious by design, so exclude them
    // DO NOT search and replace these with your own name
    // The element14 link causes a hang

    // Go ahead and start the scan! As events occur, we will see them above.
    return await checker.check({
      path,
      recurse: true,
      linksToSkip,
      urlRewriteSearch: /http:\/\/duckydevine.com/,
      urlRewriteReplace: "http://localhost:9000",
      urlRewriteExpressions: [/http:\/\/duckydevine.com/, "http://localhost:9000"], // Not working; see https://github.com/JustinBeckwith/linkinator/issues/390
      concurrency: 100, // The twitter URLs seem to work better with a high concurrency, counter-intuitively
      timeout: 30 * 1000
    });
  });

  it("internal links should all resolve", async () => {
    expect(deadInternalLinks).toEqual([]);
  });

  it("external links should all resolve", async () => {
    expect(deadExternalLinks).toEqual([]);
  });
});

const retryUrl = async url => {
  const hitUrl = async retry => {
    const { statusCode } = await curly.get(url);

    console.log(statusCode);
    if (statusCode != 200) {
      return retry(statusCode);
    }
  };
  return promiseRetry(hitUrl, { retries: 4, minTimeout: 4 * 1000 })
    .then(() => true)
    .catch(() => false);
};
