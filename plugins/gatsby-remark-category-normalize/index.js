// A plugin is perhaps overkill for this, but we want to keep the
// browser code light and get the graphql clean, so sort out case discrepancies at build time

exports.mutateSource = async ({ markdownNode }) => {
  const { frontmatter } = markdownNode;
  const { category } = frontmatter;

  // Save the original category in case something wants it
  frontmatter.displayCategory = category;
  if (category) {
    // Make sure changes here are synced to gatsby-node which has to do its own normalisation
    frontmatter.category = category.toLowerCase();
  }
};
