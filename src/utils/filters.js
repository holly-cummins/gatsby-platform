exports.generateFilter = otherFilter => {
  // Do not create draft post files in production.
  let activeEnv = process.env.ACTIVE_ENV || process.env.NODE_ENV || "development";
  // Be less chatty when testing
  if (activeEnv != "test") {
    console.log(`Using environment config: '${activeEnv}'`);
  }
  let draftsFilters = { fields: { slug: { ne: "" } } };
  if (activeEnv == "production") {
    draftsFilters = { fields: { slug: { ne: "" }, prefix: { ne: "draft" } } };
  }
  const filters = { ...draftsFilters, ...otherFilter };

  return filters;
};
exports.filterOutDrafts = edges => {
  // TODO refactor this out
  const activeEnv = process.env.ACTIVE_ENV || process.env.NODE_ENV || "development";
  if (activeEnv == "production") {
    edges = edges.filter(edge =>
      edge.node && edge.node.fields ? edge.node.fields.prefix != "draft" : true
    );
  }
  return edges;
};
