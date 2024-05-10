#!/usr/bin/env node

const fs = require("fs");
const urlMetadata = require("url-metadata");
const request = require("request");
const path = require("path");
const url = require("url");
const config = require("../src/utils/configger");

const { extract } = require("../plugins/gatsby-remark-oembed/extended-oembed-parser");

const contentDir = require("fs").existsSync("../content") ? "../content" : "./content";
const baseDir = `${contentDir}/talks`;

const UNKNOWN = "unknown";

const slidesUrl = process.argv[2];
const videoUrl = process.argv[3];

const download = async (url, fileName) => {
  return new Promise(resolve => {
    request.head(url, () => {
      request(url)
        .pipe(fs.createWriteStream(fileName))
        .on("close", resolve);
    });
  });
};

const updateGitignore = async (oembedUrl, dir) => {
  const oembedData = await extract(oembedUrl);

  const imageUrl = oembedData.thumbnail_url;
  if (imageUrl) {
    const remotePath = url.parse(imageUrl).pathname;
    const fileName = path.parse(remotePath).base;

    // Ignore the image so we can preprocess the publication locally without making a mess of the git status.
    fs.writeFileSync(`${dir}/.gitignore`, fileName + "\n", { flag: "a", encoding: "utf8" });
  }
};

const extractDate = async metadata => {
  let date = UNKNOWN;

  if (metadata) {
    const fields = Object.keys(metadata);

    // Look for something that looks like a date;
    // it varies from site to site and many don't have it at all
    const dateFields = fields.filter(name => name.includes("time") || name.includes("date"));
    const dateField = dateFields.find(field => metadata[field] && metadata[field].length > 0);
    if (dateField) {
      date = new Date(Date.parse(metadata[dateField])).toISOString().slice(0, 10);
    } else {
      // Sometimes there's a date in the json for linking data
      date = extractDate(metadata.jsonld);
    }
  }
  return date;
};

const createMarkdown = async () => {
  const metadata = await urlMetadata(slidesUrl);

  const title = metadata.title;

  const slug = path.basename(url.parse(slidesUrl).pathname);

  let date = await extractDate(metadata);

  if (!date || (date == UNKNOWN && videoUrl)) {
    const videoMetadata = await urlMetadata(videoUrl);
    date = await extractDate(videoMetadata);
    console.log("Used date from video, rather than slides.");
    console.log("Double check", date);
  }

  const ogAuthor = metadata.author;
  const myName = config.authorName.toLowerCase();
  // If the name is a variation of my name, just use my name
  let author = ogAuthor ? ogAuthor : myName;
  if (author.toLowerCase() === myName) {
    author = myName;
  }

  const dir = path.join(baseDir, `/${date}--${slug}`);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  const imageUrl = metadata["og:image"];
  let cover = "";

  // The cover image gets downloaded in preprocessing, so that we don't need to source control external content
  if (imageUrl) {
    cover = path.basename(url.parse(imageUrl).pathname);

    // console.log("downloading", imageUrl, "to ", `${dir}/${cover}`);
    // Download the ignored image to save a pre-processing step locally
    download(imageUrl, `${dir}/${cover}`);
    fs.writeFileSync(`${dir}/.gitignore`, cover + "\n", { encoding: "utf8" });
  } else {
    console.warn("WARNING: No picture provided. Add one manually.");
  }

  updateGitignore(slidesUrl, dir);
  if (videoUrl) {
    updateGitignore(videoUrl, dir);
  }

  const fileName = `${dir}/index.md`;

  // Don't include the title since the plugin will fill it in, and it
  // sometimes has a 'by' we would need to strip out
  let str = `---
cover: ${cover}
author: ${author}
category: untagged
type: talk
event: somewhere
slides:
  url: ${slidesUrl}
`;

  if (videoUrl) {
    str += `video:
  url: ${videoUrl}
`;
  }

  str += `---

${metadata.description}`;

  fs.writeFileSync(fileName, str, "utf8");
};

createMarkdown();
