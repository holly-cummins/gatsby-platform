// A plugin is perhaps overkill for this, but we want to keep the
// browser code light, so do some date manipulation at build time
const dayjs = require("dayjs");
const { createFilePath } = require(`gatsby-source-filesystem`);

const defaultOptions = {
  nodeType: "MarkdownRemark"
};

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;
  const typeDefs = `
  type Fields {
    shortDate: String
  }
  `;
  createTypes(typeDefs);
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

  // The prefix field is exactly what we want, and it doesn't seem to be in the node when we get it
  // so (with some gnashing of teeth) redo the work to find the prefix
  const fullSlug = createFilePath({ node, getNode });
  const splitted = fullSlug.replace("/", "").split("--");

  if (splitted.length > 1) {
    const prefix = splitted[0];

    try {
      const date = dayjs(prefix);
      if (date.isValid()) {
        const shortDate = date.format("MM-DD");
        createNodeField({
          node,
          name: "shortDate",
          value: shortDate
        });
      }
    } catch (e) {
      console.error("Could not shorten date", prefix, e);
    }
  }
};
