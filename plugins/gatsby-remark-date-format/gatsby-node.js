// A plugin is perhaps overkill for this, but we want to keep the
// browser code light, so do some date manipulation at build time
const dayjs = require("dayjs");
const { createFilePath } = require(`gatsby-source-filesystem`);

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

  // The prefix field is exactly what we want, and it doesn't seem to be in the node when we get it
  // so (with some gnashing of teeth) redo the work to find the prefix
  const fullSlug = createFilePath({ node, getNode });
  // Strip leading slashes and then convert others to hyphens
  let noLeadingSlash = fullSlug.replace(/^\//, "");
  const splitted = noLeadingSlash.replace("/", "-").split("--");

  if (splitted.length > 1) {
    let prefix = splitted[0];
    // Check for repeated dates in the beginning
    if (prefix.substring(0, 5) === prefix.substring(5, 10)) {
      prefix = prefix.substring(5);
    }

    try {
      let date = dayjs(prefix);
      
      if (date.isValid()) {
        const shortDate = date.format("MM-DD");
        createNodeField({
          node,
          name: "shortDate",
          value: shortDate
        });
        createNodeField({
          node,
          name: "date",
          value: date.format("YYYY-MM-DD")
        });
      } else {
        createNodeField({
          node,
          name: "draft",
          value: true
        });
      }
    } catch (e) {
      console.error("Could not shorten date", prefix, e);
    }
  }
};
