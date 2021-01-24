#!/usr/bin/env node

const fs = require("fs");
const urlMetadata = require("url-metadata");
const request = require("request");
const path = require("path");
const url = require("url");

const targetUrl = process.argv[2];

const download = async (url, fileName) => {
  return new Promise((resolve, reject) => {
    request.head(url, (err, res, body) => {
      request(url)
        .pipe(fs.createWriteStream(fileName))
        .on("close", resolve);
    });
  });
};

const createMarkdown = async () => {
  const metadata = await urlMetadata(targetUrl);

  const title = metadata.title;
  const imageUrl = metadata["og:image"];
  const cover = path.basename(url.parse(imageUrl).pathname);
  const slug = path.basename(url.parse(targetUrl).pathname);

  const ogDate = metadata["og:article:published_time"];
  const date = ogDate ? ogDate : "unknown";

  const ogAuthor = metadata.author;
  const author = ogAuthor ? ogAuthor : "holly cummins";

  const dir = `./content/publications/${date}--${slug}`;

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  const fileName = `${dir}/index.md`;

  let str = `---
title: "${title}"
url: ${targetUrl}
author: ${author}
cover: ${cover}
category: untagged
---

${metadata.description}`;

  fs.writeFileSync(fileName, str, "utf8");

  const imagePath = `${dir}/${cover}`;

  await download(imageUrl, imagePath);
};

return createMarkdown();
