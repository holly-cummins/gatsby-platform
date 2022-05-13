const nodeGeocoder = require("node-geocoder");
const ourFetch = require("node-fetch");
const flags = require("country-flag-icons/string/3x2");

const options = {
  provider: "openstreetmap",
  fetch: ourFetch // Specify a fetch to try and resolve some apparent concurrency issues
};

exports.mutateSource = async ({ markdownNode }) => {
  const { frontmatter } = markdownNode;
  const { location } = frontmatter;

  const geography = location ? await makeGeographyDetails(location) : null;
  if (geography) {
    console.log("Filling in geography for", frontmatter.title);
    frontmatter.geography = geography;
  }
};

const makeGeographyDetails = async location => {
  try {
    const geocoder = nodeGeocoder(options);
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
