const React = require("react");

exports.onRenderBody = ({ setPostBodyComponents }, pluginOptions) => {
  if (pluginOptions.id) {
    setPostBodyComponents([
      <script
        key="microanalytics"
        data-host="https://microanalytics.io"
        data-dnt="false"
        src="https://microanalytics.io/js/script.js"
        id={pluginOptions.id}
        async
        defer
      ></script>
    ]);
  }
};
