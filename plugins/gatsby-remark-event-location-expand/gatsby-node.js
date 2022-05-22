const nodeGeocoder = require("node-geocoder");
const ourFetch = require("node-fetch");
const flags = require("country-flag-icons/string/3x2");

const geoCodeOptions = {
  provider: "openstreetmap",
  fetch: ourFetch // Specify a fetch to try and resolve some apparent concurrency issues
};

const defaultOptions = {
  nodeType: "MarkdownRemark"
};

exports.onCreateNode = async ({ node, getNode, actions }, pluginOptions) => {
  const { createNodeField } = actions;

  const options = {
    ...defaultOptions,
    ...pluginOptions
  };

  if (node.internal.type !== options.nodeType) {
    return;
  }

  const { frontmatter } = node;
  const { location } = frontmatter;

  const geography = location ? await makeGeographyDetails(location) : null;
  if (geography) {
    createNodeField({
      node,
      name: "geography",
      value: geography
    });
  }
};

const makeGeographyDetails = async location => {
  try {
    const geocoder = nodeGeocoder(geoCodeOptions);
    const results = await geocoder.geocode(location);
    if (results && results.length > 0) {
      // Assume it puts the most likely first
      const res = results[0];
      const geography = {};
      geography.country = res.country;
      geography.countryCode = res.countryCode;
      const flag = flags[res.countryCode];
      if (flag) {
        const buff = Buffer.from(flag);
        geography.flag = buff.toString("base64");
      }

      return geography;
    }
  } catch (e) {
    console.log("Error getting geography information for", location);
    console.log("Error:", e);
    return null;
  }
};

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;
  const typeDefs = `
  type Geography implements Node {
    flag: String
    country: String
  }
  `;
  createTypes(typeDefs);
};
