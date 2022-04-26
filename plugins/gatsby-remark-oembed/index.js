const path = require("path");
const nodeUrl = require("url");
const fs = require("fs");
const request = require("request");

const { extract, hasProvider } = require("./extended-oembed-parser");

exports.mutateSource = async ({ markdownNode }, options) => {
  const { frontmatter } = markdownNode;
  const markdownFile = markdownNode.fileAbsolutePath;
  const maxWidth = options ? options.maxWidth : 700;

  const enrichPromises = [];

  // Make sure nothing comes through that doesn't have a cover (the preprocess script will have copied in the placeholders)
  if (!frontmatter.cover) {
    frontmatter.cover = "placeholder.png";
  }

  if (frontmatter.slides) {
    const answer = await enrich(frontmatter.slides, markdownFile, maxWidth);
    // If the main document doesn't have a title, fill one in from the slides
    if (!frontmatter.title) {
      frontmatter.title = answer.title;
    }

    if (frontmatter.cover === "placeholder.png") {
      frontmatter.cover = answer.thumbnail;
    }
    // Make sure to wait
    enrichPromises.push(new Promise(resolve => resolve(answer)));
  }

  if (frontmatter.video) {
    const answer = await enrich(frontmatter.video, markdownFile, maxWidth);

    // If the main document still doesn't have a title after doing the slides, fill one in from the video

    if (!frontmatter.title) {
      frontmatter.title = answer.title;
    }
    if (!frontmatter.cover || frontmatter.cover === "placeholder.png") {
      frontmatter.cover = answer.thumbnail;
    }

    // Make sure to wait
    enrichPromises.push(new Promise(resolve => resolve(answer)));
  }

  return Promise.all(enrichPromises);
};

const enrich = async (oembedObject, post, maxwidth) => {
  const thingsWeAreWaitingFor = [];
  const url = oembedObject.url;
  // Allow the height to be as big as the width and let youtube shrink it down;
  // Otherwise we get a small default so don't get the width
  // (This assumes things are landscape, but that is reasonable)
  const params = { maxwidth, maxheight: maxwidth };

  const shouldExtract = hasProvider(url, params);
  if (shouldExtract) {
    const oembedData = await extract(url, params);
    thingsWeAreWaitingFor.push(oembedData);
    if (oembedData) {
      Object.assign(oembedObject, {
        link: url,
        title: oembedData.title,
        html: oembedData.html
      });
      if (!oembedObject.html) {
        console.log("Filling in html for ", url);
        oembedObject.html = "<></>";
      }

      const imageUrl = oembedData.thumbnail_url;
      if (imageUrl) {
        const remotePath = nodeUrl.parse(imageUrl).pathname;
        const thumbnail = path.parse(remotePath).base;

        // Wait for the download to make sure we don't end up with half-files
        const download = await downloadThumbnail(imageUrl, post);
        thingsWeAreWaitingFor.push(download);
        oembedObject.thumbnail = thumbnail;
      }
    } else {
      // What should we do if we have an oembed provider and it returns nothing? Cry in the corner?
      console.error(`Got no oembed data for `, url);
    }
  } else {
    // Schema validation gets upset if we don't do this
    Object.assign(oembedObject, {
      link: url,
      title: "External content",
      html: `<p>See the full content <a href="${url}">here.</a></p>`
    });
  }
  return oembedObject;
};

const downloadThumbnail = async (imageUrl, file) => {
  const remotePath = nodeUrl.parse(imageUrl).pathname;
  const fileName = path.parse(remotePath).base;
  const dir = path.parse(file).dir;
  const imagePath = path.join(dir, fileName);
  if (!fs.existsSync(imagePath)) {
    console.log("Downloading", imageUrl);
    return await download(imageUrl, imagePath);
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
