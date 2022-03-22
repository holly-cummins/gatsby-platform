const path = require("path");
const nodeUrl = require("url");
const fs = require("fs");
const request = require("request");

const { extract } = require("./extended-oembed-parser");

exports.mutateSource = async ({ markdownNode }, options) => {
  const { frontmatter } = markdownNode;
  const markdownFile = markdownNode.fileAbsolutePath;

  if (frontmatter.slides) {
    await enrich(frontmatter.slides, markdownFile, options.maxWidth);
    // If the main document doesn't have a title, fill one in from the slides
    if (!frontmatter.title) {
      frontmatter.title = frontmatter.slides.title;
    }

    // It doesn't seem to work to totally skip the cover, so we put a placeholder
    // in the physical file and then overwrite it here
    if (!frontmatter.cover || frontmatter.cover == "placeholder.png") {
      frontmatter.cover = frontmatter.slides.thumbnail;
    }
  }

  if (frontmatter.video) {
    await enrich(frontmatter.video, markdownFile, options.maxWidth);
    // If the main document still doesn't have a title after doing the slides, fill one in from the video
    if (!frontmatter.title) {
      frontmatter.title = frontmatter.video.title;
    }
    if (!frontmatter.cover || frontmatter.cover == "placeholder.png") {
      frontmatter.cover = frontmatter.video.thumbnail;
    }
  }
};

const enrich = async (oembedObject, post, maxwidth) => {
  const url = oembedObject.url;
  // Allow the height to be as big as the width and let youtube shrink it down;
  // Otherwise we get a small default so don't get the width
  const params = { maxwidth, maxheight: maxwidth };

  const oembedData = await extract(url, params);
  if (oembedData) {
    const imageUrl = oembedData.thumbnail_url;
    const remotePath = nodeUrl.parse(imageUrl).pathname;
    const thumbnail = path.parse(remotePath).base;

    // No need to wait for the download
    downloadThumbnail(imageUrl, post);

    Object.assign(oembedObject, {
      link: url,
      title: oembedData.title,
      html: oembedData.html,
      thumbnail
    });
  }
};

const downloadThumbnail = async (imageUrl, file) => {
  const remotePath = nodeUrl.parse(imageUrl).pathname;
  const fileName = path.parse(remotePath).base;
  const dir = path.parse(file).dir;
  const imagePath = path.join(dir, fileName);
  if (!fs.existsSync(imagePath)) {
    if (imageUrl) {
      console.log("Downloading", imageUrl);
      download(imageUrl, imagePath);
    } else {
      console.error("ERROR: Cover image does not exist and imageUrl is not set for", post);
    }
  } else {
    console.log(fileName, "already exists, skipping.");
  }
};

const download = async (url, fileName) => {
  return new Promise(resolve => {
    request.head(url, () => {
      request(url)
        .pipe(fs.createWriteStream(fileName))
        .on("close", resolve);
    });
  });
};
