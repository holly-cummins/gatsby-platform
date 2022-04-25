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
  // Be less chatty when testing (we can't use the env for this because a test may change it)
  if (!process.env.SUPPRESS_ENV_OUTPUT) {
    console.log(`Using environment config: '${activeEnv}'`);
  }
  return activeEnv === "production";
};

exports.generateFilter = otherFilter => {
  let draftsFilters = { fields: { slug: { ne: "" } } };

  if (isProd()) {
    draftsFilters = { fields: { slug: { ne: "" }, prefix: { regex: DATE_REGEX.toString() } } };
  }
  return { ...draftsFilters, ...otherFilter };
};

exports.filterOutDrafts = (edges, showFuture) => {
  // Do this filtering here so that it is dynamic, rather than being done at build-time
  const now = new Date().getTime();
  return edges.filter(edge => {
    if (edge.node && edge.node.fields) {
      // Exclude anything that looks like a draft in production

      if (isProd()) {
        // The prefix should exist and match a date in prod
        // We have to parse a date so we know if it is date-y but we want to use the same regex we use in the graphql filters
        if (!DATE_REGEX.test(edge.node.fields.prefix)) {
          return false;
        }
      }

      if (!showFuture) {
        const date = new Date(edge.node.fields.prefix);
        const isInTheFuture = date.getTime() > now;
        return !isInTheFuture;
      }

      return true;
    }
    // If there is no prefix at all, let it through (because otherwise tests get bogged down in boilerplate)
    return true;
  });
};
