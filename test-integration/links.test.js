jest.setTimeout(180 * 1000);

const link = require("linkinator");

describe("site links", () => {
  const deadExternalLinks = [];
  const deadInternalLinks = [];

  beforeAll(async () => {
    // create a new `LinkChecker` that we'll use to run the scan.
    const checker = new link.LinkChecker();

    // Respond to the beginning of a new page being scanned
    checker.on("pagestart", url => {
      // console.log(`Scanning ${url}`);
    });

    // After a page is scanned, check out the results!
    checker.on("link", result => {
      if (result.state === "BROKEN") {
        const errorText = result.failureDetails[0].statusText || result.failureDetails[0].code;
        const description = `${result.url} => ${result.status} (${errorText}) on ${result.parent}`;
        if (result.internal) {
          // TODO this will always be false as linkinator does not give us this
          if (!deadInternalLinks.includes(description)) {
            deadInternalLinks.push(description);
          }
        } else {
          if (!deadExternalLinks.includes(description)) {
            deadExternalLinks.push(description);
          }
        }
      }
    });

    const excludedLinks = [
      "https://twitter.com/ducky_devine",
      "https://www.linkedin.com/in/ducky-devine/",
      "https://www.linkedin.com/in/holly-k-cummins/",
      "https://www.manning.com/books/d-is-for-duck", // known 404, DO NOT SEARCH AND REPLACE
      "https://github.com/ducky-devine", // known 404, DO NOT SEARCH AND REPLACE
      "https://ducky-devine.medium.com", // known 404, DO NOT SEARCH AND REPLACE
      "https://www.manning.com/books/enterprise-osgi-in-action",
      "https://www.klarkteknik.com/product.html?modelCode=P0DPA",
      "https://www.cnbc.com/2016/05/03/this-blind-man-is-running-a-155-mile-ultra-marathon-with-the-help-of-an-ibm-app.html",
      "http://www.element14.com/community/thread/26532/l/quick-start-of-pcduino-without-a-hdmi-monitor-and-serial-debug-cable?displayFullThread=true",
      "https://www.uk.mercer.com/our-thinking/the-gender-pay-gap-in-uk-tech-sector.html"
    ]; // We know these links are good and we want to not hit the rate limiters since they appear everywhere
    // Manning and KlarkTeknik seem to have a bot-blocker, which is annoying, since the link seems likely to break
    // NOTE: The Manning, Medium, and gitgub D is For Duck is fictitious by design, so exclude them
    // DO NOT search and replace these with your own name
    // The element14 link causes a hang

    // Go ahead and start the scan! As events occur, we will see them above.
    await checker.check({
      path: "http://localhost:9000",
      recurse: true,
      linksToSkip: excludedLinks,
      urlRewriteSearch: /http:\/\/duckydevine.com/,
      urlRewriteReplace: "http://localhost:9000",
      urlRewriteExpressions: [/http:\/\/duckydevine.com/, "http://localhost:9000"],
      concurrency: 100
    });
  });

  it("internal links should all resolve", async () => {
    expect(deadInternalLinks).toEqual([]);
  });

  it("external links should all resolve", async () => {
    expect(deadExternalLinks).toEqual([]);
  });
});
