const nodegeocoder = require("node-geocoder");
const flags = require("country-flag-icons/string/3x2");

const options = {
  provider: "openstreetmap"

  // Optional depending on the providers
  //  fetch: customFetchImplementation,
};

exports.mutateSource = async ({ markdownNode }) => {
  const { frontmatter } = markdownNode;
  const { location } = frontmatter;

  if (location) {
    try {
      const geocoder = nodegeocoder(options);
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
        frontmatter.geography = geography;
      }
    } catch (e) {
      console.log(
        "Error getting geography information for",
        location,
        'on "',
        frontmatter.title,
        '"'
      );
      console.log("Error:", e);
    }
  }
};
