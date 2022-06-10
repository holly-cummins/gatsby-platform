// This test relies on a mock in __mocks__. To validate things against
// the real implementation, rename __mocks__/node-geocoder.js to something else temporarily.

const mockedGeocoder = require("node-geocoder");
const geocoder = require("./caching-geocoder");

const fs = require("fs/promises");
jest.mock("fs/promises");

const cacheFile = geocoder.resolveCacheFile();

const cache = require(cacheFile);
jest.mock(cacheFile);
cache.Lima = [{ country: "NotPeru" }];

const mockedGeocoderInstance = mockedGeocoder();

describe("the parser", () => {
  it("goes to the geocoder if the cache is empty", async () => {
    expect(mockedGeocoderInstance.geocode).toHaveBeenCalledTimes(0);
    const answer = await geocoder.geocode("Milan");
    // Basic sense check for the response
    expect(answer).toBeTruthy();
    expect(answer[0].country).toEqual("Italy");
    expect(mockedGeocoderInstance.geocode).toHaveBeenCalledTimes(1);
  });

  it("does not go to the geocoder if the cache is populated", async () => {
    // Warm the cache
    await geocoder.geocode("Toronto");
    const count = mockedGeocoderInstance.geocode.mock.calls.length;
    const answer = await geocoder.geocode("Toronto");
    await geocoder.geocode("Toronto");
    // Basic sense check for the response
    expect(answer).toBeTruthy();
    expect(answer[0].country).toEqual("Canada");
    expect(mockedGeocoderInstance.geocode).toHaveBeenCalledTimes(count);
  });

  it("reads the cache from disk", async () => {
    const answer = await geocoder.geocode("Lima");
    expect(answer).toBeTruthy();
    // Distinctive answer which must have come from the mock
    expect(answer[0].country).toEqual("NotPeru");
  });

  it("writes the cache back out to disk when called", async () => {
    await geocoder.persistCache();
    expect(fs.writeFile).toHaveBeenCalled();
    // This is a bit writing-the-implementation-down-twice style of testing but it's hard to unit test otherwise
    expect(fs.writeFile).toHaveBeenCalledWith(cacheFile, JSON.stringify(cache, null, " "));
  });
});
