exports.pluginOptionsSchema = ({ Joi }) => {
  return Joi.object({
    id: Joi.string()
      .optional()
      .description(`The ID given by microanalytics.io. (If missing, analytics will not be shared.)`)
  });
};

// Log out information after a build is done
exports.onPostBuild = ({ reporter }) => {
  reporter.info(`Microanalytics.io tags have been added.`);
};
