// A plugin is perhaps overkill for this, but we want to keep the
// browser code light, so do some date manipulation at build time
const dayjs = require("dayjs");

exports.mutateSource = ({ markdownNode }) => {
  const { fields } = markdownNode;
  const { prefix } = fields;

  try {
    const date = dayjs(prefix);
    console.log("Date is", date);
    if (date.isValid()) {
      const shortDate = date.format("MM-DD");
      console.log("So short is", shortDate);
      fields.shortDate = shortDate;
    }
  } catch (e) {
    console.error("Could not shorten date", prefix, e);
  }
};
