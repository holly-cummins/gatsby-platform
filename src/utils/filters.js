// Do not create draft post files in production.
// This is dynamic rather than a constant for ease of testing
const isProd = () => {
  const activeEnv = process.env.ACTIVE_ENV || process.env.NODE_ENV || "development";
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
    draftsFilters = { fields: { slug: { ne: "" }, prefix: { ne: "draft" } } };
  }
  const filters = { ...draftsFilters, ...otherFilter };

  return filters;
};

exports.filterOutDrafts = edges => {
  if (isProd()) {
    edges = edges.filter(edge =>
      edge.node && edge.node.fields ? edge.node.fields.prefix != "draft" : true
    );
  }
  return edges;
};
