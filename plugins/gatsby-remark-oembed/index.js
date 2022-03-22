const { extract } = require("./extended-oembed-parser");

exports.mutateSource = async ({ markdownNode }) => {
  const { frontmatter } = markdownNode;

  if (frontmatter.slides) {
    await enrich(frontmatter.slides);
    // If the main document doesn't have a title, fill one in from the slides
    if (!frontmatter.title) {
      frontmatter.title = frontmatter.slides.title;
    }
  }

  if (frontmatter.video) {
    await enrich(frontmatter.video);
    // If the main document still doesn't have a title after doing the slides, fill one in from the video
    if (!frontmatter.title) {
      frontmatter.title = frontmatter.video.title;
    }
  }
};

const enrich = async oembedObject => {
  const url = oembedObject.url;

  const oembedData = await extract(url);
  if (oembedData) {
    Object.assign(oembedObject, { link: url, title: oembedData.title, html: oembedData.html });
  }
};
