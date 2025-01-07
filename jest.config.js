module.exports = {
  transform: {
    "^.+\\.jsx?$": `<rootDir>/jest-preprocess.js`,
    "\\.yaml$": "jest-transform-yaml"
  },
  moduleFileExtensions: ["js", "jsx", "ts", "tsx", "yml", "yaml"],
  moduleNameMapper: {
    ".+\\.(css|styl|less|sass|scss)$": `identity-obj-proxy`,
    ".+\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": `<rootDir>/__mocks__/file-mock.js`,
    "fontsource-open-sans": "identity-obj-proxy",
    "^gatsby-core-utils/(.*)$": `gatsby-core-utils/dist/$1`, // Workaround for https://github.com/facebook/jest/issues/9771
    "^gatsby-plugin-utils/(.*)$": [`gatsby-plugin-utils/dist/$1`, `gatsby-plugin-utils/$1`], // Workaround for https://github.com/facebook/jest/issues/9771
    "^uuid$": require.resolve("uuid") // See https://github.com/nestjs/nest/issues/9930
  },
  testPathIgnorePatterns: [`node_modules`, `\\.cache`, `<rootDir>.*/public`],
  transformIgnorePatterns: [`<rootDir>/node_modules/(?!(rehype-react|hast-util-to-jsx-runtime|estree-util-is-identifier-name|devlop|gatsby)/)`],
  globals: {
    __PATH_PREFIX__: ``
  },
  testEnvironmentOptions: { url: `http://localhost` },
  setupFiles: [`<rootDir>/loadershim.js`],
  setupFilesAfterEnv: ["<rootDir>/jest-setup.js"],
  testEnvironment: "jsdom"
};
