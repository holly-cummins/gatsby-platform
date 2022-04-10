const fs = require("fs");
const path = require("path");
const contentDir = process.env.USE_SAMPLE_CONTENT ? "../../content" : "../../../content";

// The require and existsSync functions use different base dirs, so we need to resolve the path
const absoluteContentPath = path.resolve(__dirname, contentDir);
if (!fs.existsSync(absoluteContentPath)) {
  console.error(
    `The content directory ${absoluteContentPath} does not exist. Do you need to set the USE_SAMPLE_CONTENT environment variable to true?`
  );
} else {
  const config = require(`${contentDir}/meta/config`);
  module.exports = config;
}
