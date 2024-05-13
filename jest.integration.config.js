module.exports = {
  preset: "jest-puppeteer",
  testPathIgnorePatterns: [".cache"],
  setupFilesAfterEnv: ["expect-puppeteer"],
  // Add ESM dependencies into the group in this pattern
  transformIgnorePatterns: [
    `<rootDir>/node_modules/(?!(rehype-react|linkinator|srcset|url-exist|is-url-superb|ky-universal|ky|gatsby)/)`
  ]
};
