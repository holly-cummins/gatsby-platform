const nodegeocoder = require("node-geocoder");

const options = {
  provider: "openstreetmap"

  // Optional depending on the providers
  //  fetch: customFetchImplementation,
};

const geocoder = nodegeocoder(options);

exports.mutateSource = async ({ markdownNode }) => {
  const { frontmatter } = markdownNode;
  const { location } = frontmatter;

  if (location) {
    const results = await geocoder.geocode(location);
    if (results && results.length > 0) {
      // Assume it puts the most likely first
      const res = results[0];
      frontmatter.country = res.country;
      frontmatter.countryCode = res.countryCode;
    }
  }
};
