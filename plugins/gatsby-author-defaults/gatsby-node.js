const configger = require("../../src/utils/configger");
const defaultOptions = {
  nodeType: "MarkdownRemark"
};

exports.onCreateNode = ({ node, getNode, actions }, pluginOptions) => {
  const { createNodeField } = actions;

  const options = {
    ...defaultOptions,
    ...pluginOptions
  };

  const defaultAuthor = configger.authorName;

  if (node.internal.type !== options.nodeType) {
    return;
  }

  const { frontmatter } = node;
  const { author } = frontmatter;

  const nonNullAuthor = author ? author : defaultAuthor;
  createNodeField({
    node,
    name: "author",
    value: nonNullAuthor
  });
};
