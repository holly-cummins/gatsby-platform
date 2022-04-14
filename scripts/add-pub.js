#!/usr/bin/env node

const fs = require("fs");
const urlMetadata = require("url-metadata");
const request = require("request");
const path = require("path");
const url = require("url");
const config = require("../src/utils/configger");

const targetUrl = process.argv[2];

const download = async (url, fileName) => {
  return new Promise(resolve => {
    request.head(url, (err, res, body) => {
      request(url)
        .pipe(fs.createWriteStream(fileName))
        .on("close", resolve);
    });
  });
};

const extractDate = async metadata => {
  let date = "unknown";

  // Look for something that looks like a date;
  // it varies from site to site and many don't have it at all
  const fields = Object.keys(metadata);
  const dateFields = fields.filter(name => name.includes("time") || name.includes("date"));
  const dateField = dateFields.find(field => metadata[field] && metadata[field].length > 0);
  if (dateField) {
    date = new Date(Date.parse(metadata[dateField])).toISOString().slice(0, 10);
  } else {
    // Sometimes there's a date in the json for linking data
    date = extractDate(metadata.jsonld);
  }
  return date;
};

const createMarkdown = async () => {
  const metadata = await urlMetadata(targetUrl);

  const title = metadata.title;

  const slug = path.basename(url.parse(targetUrl).pathname);

  // Look for something that looks like a date;
  // it varies from site to site and many don't have it at all
  const date = await extractDate(metadata);

  const ogAuthor = metadata.author;
  const myName = config.authorName.toLowerCase();
  // If the name is a variation of my name, just use my name
  let author = ogAuthor ? ogAuthor : myName;
  if (author.toLowerCase() === myName) {
    author = myName;
  }

  const contentDir = require("fs").existsSync("../content") ? "../content" : "./content";
  const dir = `./${contentDir}/publications/${date}--${slug}`;

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

    // Ignore the image so we can preprocess the publication locally without making a mess of the git status.
    fs.writeFileSync(`${dir}/.gitignore`, cover, "utf8");
  } else {
    console.warn("WARNING: No picture provided. Add one manually.");
  }

  const fileName = `${dir}/index.md`;

  let str = `---
title: "${title}"
url: ${targetUrl}
imageUrl: ${imageUrl}
cover: ${cover}
author: ${author}
category: untagged
type: blog
---

${metadata.description}`;

  fs.writeFileSync(fileName, str, "utf8");
};

createMarkdown();
