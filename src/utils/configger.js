let config;
try {
  config = require("../../../content/meta/config");
} catch (error) {
  config = require("../../content/meta/config");
}

module.exports = config;
