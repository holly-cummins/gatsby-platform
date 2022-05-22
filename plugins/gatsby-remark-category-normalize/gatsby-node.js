// A plugin is perhaps overkill for this, but we want to keep the
// browser code light and get the graphql clean, so sort out case discrepancies at build time

const defaultOptions = {
  nodeType: "MarkdownRemark"
};

exports.onCreateNode = ({ node, getNode, actions }, pluginOptions) => {
  const { createNodeField } = actions;

  const options = {
    ...defaultOptions,
    ...pluginOptions
  };

  if (node.internal.type !== options.nodeType) {
    return;
  }

  const { frontmatter } = node;
  const { category } = frontmatter;

  // Save the original category in case something wants it
  createNodeField({
    node,
    name: "displayCategory",
    value: category
  });
  if (category) {
    // Make sure changes here are synced to gatsby-node which has to do its own normalisation
    createNodeField({
      node,
      name: "category",
      value: category.toLowerCase()
    });
  }
};
