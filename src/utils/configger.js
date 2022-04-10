let config;
try {
  const config = require("../../../content/meta/config");
} catch (error) {
  config = require("../../content/meta/config");
}

module.exports = config;
