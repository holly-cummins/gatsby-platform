const path = require("path");
const nodeUrl = require("url");
const fs = require("fs");
const request = require("request");

const { extract, hasProvider } = require("./extended-oembed-parser");

const defaultOptions = {
  placeholder: "/content/images/placeholder.png",
  nodeType: "MarkdownRemark",
  maxWidth: 700
};

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;
  createTypes(`
   type OEmbed implements Node {
    url: String
    title: String
    html: String
  }
  type Fields {
   cover: File @fileByRelativePath
   video: OEmbed
   slides: OEmbed
}`);
};

exports.onCreateNode = async ({ node, getNode, actions }, pluginOptions) => {
  const { createNodeField } = actions;

  const options = {
    ...defaultOptions,
    ...pluginOptions
  };

  if (node.internal.type !== options.nodeType) {
    return;
  }

  const { frontmatter } = node;
  const markdownFile = node.fileAbsolutePath;
  const { maxWidth } = options;

  const enrichPromises = [];

  // Make sure nothing comes through that doesn't have a cover
  let cover = frontmatter.cover ? frontmatter.cover : options.placeholder;
  let title = frontmatter.title;

  if (frontmatter.slides) {
    const answer = await enrich(frontmatter.slides, markdownFile, maxWidth, enrichPromises);
    // If the main document doesn't have a title, fill one in from the slides
    if (!title) {
      title = answer.title;
    }

    if (cover === options.placeholder && answer.thumbnail) {
      cover = answer.thumbnail;
    }

    createNodeField({
      node,
      name: "slides",
      value: answer
    });

    // Make sure to wait
    enrichPromises.push(new Promise(resolve => resolve(answer)));
  }

  if (frontmatter.video) {
    const answer = await enrich(frontmatter.video, markdownFile, maxWidth, enrichPromises);

    // If the main document still doesn't have a title after doing the slides, fill one in from the video

    if (!title) {
      title = answer.title;
    }
    if (cover === options.placeholder && answer.thumbnail) {
      cover = answer.thumbnail;
    }

    createNodeField({
      node,
      name: "video",
      value: answer
    });

    // Make sure to wait
    enrichPromises.push(new Promise(resolve => resolve(answer)));
  }

  // We can't update the frontmatter except in a plugin to remark-transformer,
  // so our new unified title and cover live in the fields object
  createNodeField({
    node,
    name: "cover",
    value: cover
  });

  createNodeField({
    node,
    name: "title",
    value: title
  });

  return Promise.all(enrichPromises);
};

// This should probably be a source plugin which puts things into the cache,
// but for the moment this will do
const enrich = async (oembedObject, post, maxwidth, thingsWeAreWaitingFor) => {
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
