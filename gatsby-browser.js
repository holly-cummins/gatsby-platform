/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/browser-apis/
 */

const ReactDOM = require("react-dom/client");

// See https://github.com/gatsbyjs/gatsby/discussions/36232; it would be ideal to get rid of this, but integration tests fail in ci without it

exports.replaceHydrateFunction = () => {
  return (element, container) => {
    const root = ReactDOM.createRoot(container);
    root.render(element);
  };
};
