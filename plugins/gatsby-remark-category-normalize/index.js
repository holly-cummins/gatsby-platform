// A plugin is perhaps overkill for this, but we want to keep the
// browser code light and get the graphql clean, so sort out case discrepancies at build time

exports.mutateSource = async ({ markdownNode }) => {
  const { frontmatter } = markdownNode;
  const { category } = frontmatter;

  // Save the original category in case something wants it
  frontmatter.displayCategory = category;
  if (category) {
    frontmatter.category = category.toLowerCase();
  }
};
