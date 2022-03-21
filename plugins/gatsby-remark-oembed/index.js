const { extract, setProviderList } = require("oembed-parser");

// Add notist in as a provider since it's not in the list on oembed.com
// Ideally we would pull this dynamically in a build, but it doesn't change often
const defaultProviderList = require("./providers.json");
const notistProvider = {
  provider_name: "notist",
  provider_url: "http://noti.st",
  endpoints: [
    {
      schemes: ["https://noti.st/*/*"],
      url: "https://noti.st/api/oembed"
    }
  ]
};
const providers = [...defaultProviderList, notistProvider];
try {
  setProviderList(providers);
} catch (error) {
  console.error("Could not adjust oembed providers: ", error);
}

exports.mutateSource = async ({ markdownNode }) => {
  const { frontmatter } = markdownNode;

  if (frontmatter.slides) {
    const url = frontmatter.slides.url;

    const oembedData = await extract(url);
    if (oembedData) {
      frontmatter.slides = { link: url, title: oembedData.title, html: oembedData.html };
      // If the main document doesn't have a title, fill one in from the slides
      if (!frontmatter.title) {
        frontmatter.title = oembedData.title;
      }
    }
  }

  if (frontmatter.video) {
    const url = frontmatter.video.url;

    const oembedData = await extract(url);
    if (oembedData) {
      frontmatter.video = { link: url, title: oembedData.title, html: oembedData.html };
      // If the main document still doesn't have a title after doing the slides, fill one in from the video
      if (!frontmatter.title) {
        frontmatter.title = oembedData.title;
      }
    }
  }
};
