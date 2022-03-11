const { extract } = require("oembed-parser");

exports.mutateSource = async ({ markdownNode }) => {
  const { frontmatter } = markdownNode;

  if (frontmatter.video) {
    const url = frontmatter.video.url;

    const oembedData = await extract(url);
    if (oembedData) {
      frontmatter.video = { link: url, title: oembedData.title, html: oembedData.html };
      // If the main document doesn't have a title, fill one in from the video
      if (!frontmatter.title) {
        frontmatter.title = oembedData.title;
      }
    }
  }
};
