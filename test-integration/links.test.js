jest.setTimeout(180 * 1000);

const { SiteChecker } = require("broken-link-checker");

describe("site links", () => {
  const deadExternalLinks = [];
  const deadInternalLinks = [];

  beforeAll(async () => {
    const promise = new Promise((resolve, reject) => {
      const siteChecker = new SiteChecker(
        {
          excludeInternalLinks: false,
          excludeExternalLinks: false,
          retryHeadCodes: [404, 405],
          maxSocketsPerHost: 1,
          filterLevel: 0,
          acceptedSchemes: ["http", "https"],
          userAgent:
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:91.0) Gecko/20100101 Firefox/91.0", // Twitter is fussy about the user agent and will not serve to bots
          excludedKeywords: [
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
          ] // We know these links are good and we want to not hit the rate limiters since they appear everywhere
          // Manning and KlarkTeknik seem to have a bot-blocker, which is annoying, since the link seems likely to break
          // NOTE: The Manning, Medium, and gitgub D is For Duck is fictitious by design, so exclude them
          // DO NOT search and replace these with your own name
          // The element14 link causes a hang
        },
        {
          error: error => {
            console.log("Rejecting promise in sitechecker: ", error);
            reject(error);
          },
          link: result => {
            if (result.broken) {
              if (
                result.http.response &&
                ![undefined, 200].includes(result.http.response.statusCode)
              ) {
                const description = `${result.url.original} => ${result.http.response.statusCode} (${result.http.response.statusMessage}) on ${result.base.original}`;
                if (result.internal) {
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
          },
          end: () => {
            resolve();
          }
        }
      );
      siteChecker.enqueue("http://localhost:9000/");
    });
    await promise;
  });

  it("internal links should all resolve", async () => {
    expect(deadInternalLinks).toEqual([]);
  });

  it("external links should all resolve", async () => {
    expect(deadExternalLinks).toEqual([]);
  });
});
