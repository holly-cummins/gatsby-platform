const nodeGeocoder = require("node-geocoder");
const ourFetch = require("node-fetch");

const geoCodeOptions = {
  provider: "openstreetmap",
  fetch: ourFetch // Specify a fetch to try and resolve some apparent concurrency issues
};

const locationCache = {};

exports.geocode = async location => {
  if (locationCache[location]) {
    return locationCache[location];
  } else {
    try {
      // Recreate every call to get a fresh instance to try and improve concurrency behaviour
      const geocoder = nodeGeocoder(geoCodeOptions);
      const results = await geocoder.geocode(location);
      locationCache[location] = results;
      return results;
    } catch (e) {
      console.log("Error getting geography information for", location);
      console.log("Error:", e);
      return null;
    }
  }
};
