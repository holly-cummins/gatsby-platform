const { extract, setProviderList } = require("oembed-parser");

// Add notist in as a provider since it's not in the list on oembed.com
// Ideally we would pull this dynamically in a build, but it doesn't change often
const defaultProviderList = require("./providers.json");
const notistProvider = {
  provider_name: "notist",
  provider_url: "http://noti.st",
  endpoints: [
    {
      schemes: ["https://noti.st/*/*"],
      url: "https://noti.st/api/oembed"
    }
  ]
};

const providers = [...defaultProviderList, notistProvider];
try {
  setProviderList(providers);
} catch (error) {
  console.error("Could not adjust oembed providers: ", error);
}

exports.extract = (url, params) => {
  return extract(url, params);
};
