exports.pluginOptionsSchema = ({ Joi }) => {
  return Joi.object({
    id: Joi.string()
      .required()
      .description(`The ID given by microanalytics.io.`)
  });
};

// Log out information after a build is done
exports.onPostBuild = ({ reporter }) => {
  reporter.info(`Microanalytics.io tags have been added.`);
};
