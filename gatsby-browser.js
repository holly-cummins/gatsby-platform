/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/browser-apis/
 */

import "@fontsource/open-sans"; // Defaults to weight 400 with normal variant.
import "@fontsource/open-sans/600.css";

import "./src/theme/global.css";

import ReactDOM from "react-dom/client";

// See https://github.com/gatsbyjs/gatsby/discussions/36232; it would be ideal to get rid of this, but integration tests fail in ci without it
export function replaceHydrateFunction() {
  return (element, container) => {
    const root = ReactDOM.createRoot(container);
    root.render(element);
  };
}
