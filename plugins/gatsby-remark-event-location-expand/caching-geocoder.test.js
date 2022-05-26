// This test relies on a mock in __mocks__. To validate things against
// the real implementation, rename __mocks__/node-geocoder.js to something else temporarily.

const mockedGeocoder = require("node-geocoder");
const mockedGeocoderInstance = mockedGeocoder();

const geocoder = require("./caching-geocoder");

describe("the parser", () => {
  it("goes to the geocoder if the cache is empty", async () => {
    expect(mockedGeocoderInstance.geocode).toHaveBeenCalledTimes(0);
    const answer = await geocoder.geocode("Toronto");
    // Basic sense check for the response
    expect(answer).toBeTruthy();
    expect(answer[0].country).toEqual("Canada");
    expect(mockedGeocoderInstance.geocode).toHaveBeenCalledTimes(1);
  });

  it("does not go to the geocoder if the cache is populated", async () => {
    await geocoder.geocode("Toronto");
    const count = mockedGeocoderInstance.geocode.mock.calls.length;
    const answer = await geocoder.geocode("Toronto");
    await geocoder.geocode("Toronto");
    // Basic sense check for the response
    expect(answer).toBeTruthy();
    expect(answer[0].country).toEqual("Canada");
    expect(mockedGeocoderInstance.geocode).toHaveBeenCalledTimes(count);
  });
});
