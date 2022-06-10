const nodeGeocoder = require("node-geocoder");
const fs = require("fs/promises");
const fss = require("fs");
const path = require("path");

const cacheFile = resolveCacheFile();
const locationCache = require(path.relative(__dirname, cacheFile));

const geoCodeOptions = {
  provider: "openstreetmap"
};

const geocode = async location => {
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

const persistCache = async () => {
  return fs.writeFile(cacheFile, JSON.stringify(locationCache, null, " "));
};

// We need to be a bit elaborate here, because we don't want to dump site-specific cache content into the
// generic source, so use the site-specific content directory to hold things
function resolveCacheFile() {
  // Use the cache in the external content directory if we have one
  let contentMetaDir = "../content/meta";
  if (!fss.existsSync(contentMetaDir)) {
    contentMetaDir = "./content/meta";
  }
  const file = path.resolve(contentMetaDir, "location-cache.json");

  if (!fss.existsSync(file)) {
    fss.writeFileSync(file, "{}");
  }

  return path.resolve(file);
}

module.exports = { geocode, persistCache, resolveCacheFile };
