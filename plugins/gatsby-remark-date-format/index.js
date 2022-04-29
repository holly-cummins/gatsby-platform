// A plugin is perhaps overkill for this, but we want to keep the
// browser code light, so do some date manipulation at build time
const dayjs = require("dayjs");

exports.mutateSource = ({ markdownNode }, options) => {
  const { fields } = markdownNode;
  const { prefix } = fields;

  const date = dayjs(prefix);
  const shortDate = date.format("MM-DD");
  if (date.isValid()) {
    fields.shortDate = shortDate;
  }
};
