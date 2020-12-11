const babelOptions = {
  presets: ["babel-preset-gatsby"],
  plugins: [["styled-jsx/babel", { plugins: ["styled-jsx-plugin-postcss"] }]]
};
module.exports = require("babel-jest").createTransformer(babelOptions);
