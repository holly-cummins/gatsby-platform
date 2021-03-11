export function draftsFilter(otherFilter) {
  // Do not create draft post files in production.
  let activeEnv = process.env.ACTIVE_ENV || process.env.NODE_ENV || "development";
  // Be less chatty when testing
  if (activeEnv != "test") {
    console.log(`Using environment config: '${activeEnv}'`);
  }
  let draftsFilters = { fields: { slug: { ne: "" } } };
  if (activeEnv == "production") {
    draftsFilters = { fields: { slug: { ne: "" }, prefix: { ne: "" } } };
  }
  const filters = { ...draftsFilters, ...otherFilter };
  // We're trying to convert the object into something that looks like code, which is surprisingly tricky ...
  /// ... especially with the constraint we want it to look like the code we already have, for ease of testing
  const filterString = JSON.stringify(filters)
    .replace(/\"(\$?[a-z][a-z]*)\":/g, "$1: ") // assume all lower case
    .replace(/\"\$([a-z][a-z]*)\"/g, "$$$1") // handle variables starting with a dollar sign, which should not be quoted
    .replace(/:{/g, ": {")
    .replace(/{/g, "{ ")
    .replace(/}/g, " }")
    .replace(/,/g, ", ");
  // Someday, I'll fix that, and because I did TDD, it will be easy. I promise.
  return `filter: ${filterString}`;
}
