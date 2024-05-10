exports.pluginOptionsSchema = ({ Joi }) => {
  return Joi.object({
    dataToken: Joi.string()
      .optional()
      .description(
        `The data token from the beamanalytics.io onboarding. (If missing, analytics will not be shared.)`
      )
  });
};

// Log out information after a build is done
exports.onPostBuild = ({ reporter }) => {
  reporter.info(`beamanalytics.io tags have been added.`);
};
