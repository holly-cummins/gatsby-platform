const React = require("react");

exports.onRenderBody = ({ setHeadComponents }, pluginOptions) => {
  if (pluginOptions.dataToken && process.env.NODE_ENV === "production") {
    setHeadComponents([
      <script
        key="beam"
        src="https://beamanalytics.b-cdn.net/beam.min.js"
        data-token={pluginOptions.dataToken}
        async
      ></script>
    ]);
  }
};
