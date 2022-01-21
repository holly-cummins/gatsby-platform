// Matches dates or single digit numbers (for src/pages which are site furniture)
const DATE_REGEX = /^\d$|\d{4}-\d{2}-\d{2}/;
// Export for ease of testing
exports.DATE_REGEX = DATE_REGEX;

// Do not create draft post files in production.
// This is dynamic rather than a constant for ease of testing
// See https://www.gatsbyjs.com/docs/how-to/local-development/environment-variables/ for details of the GATSBY_ variables
// GATSBY_ACTIVE_ENV is the only one of these which 'sticks' in the client side
const isProd = () => {
  const activeEnv =
    process.env.GATSBY_ACTIVE_ENV ||
    process.env.ACTIVE_ENV ||
    process.env.NODE_ENV ||
    "development";
  // Be less chatty when testing
  if (activeEnv != "test") {
    console.log(`Using environment config: '${activeEnv}'`);
  }
  const isProd = activeEnv == "production";
  return isProd;
};

exports.generateFilter = otherFilter => {
  let draftsFilters = { fields: { slug: { ne: "" } } };

  if (isProd()) {
    draftsFilters = { fields: { slug: { ne: "" }, prefix: { regex: DATE_REGEX.toString() } } };
  }
  const filters = { ...draftsFilters, ...otherFilter };

  return filters;
};

exports.filterOutDrafts = edges => {
  if (isProd()) {
    edges = edges.filter(edge => {
      if (edge.node && edge.node.fields) {
        // The prefix should exist and match a date in prod
        return DATE_REGEX.test(edge.node.fields.prefix);
      } else {
        // If there is no prefix at all, let it through (because otherwise tests get bogged down in boilerplate)
        return true;
      }
    });
  }
  return edges;
};
