const { extract } = require("oembed-parser");

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
