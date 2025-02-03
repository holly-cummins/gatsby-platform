import PropTypes from "prop-types";
import React, { createRef } from "react";
import { graphql } from "gatsby";

const { siteUrl } = require("../utils/configger");
import Article from "../components/Article";
import QRCode from "react-qr-code";
import { useScreenshot, createFileName } from "use-react-screenshot";

const button = {
  width: "150px",
  padding: "10px",
  color: "white",
  backgroundColor: "black",
  borderRadius: "4px",
  border: "0 black solid"
};
const QrCodeTemplate = props => {
  const {
    pageContext: { slug }
  } = props;

  const url = `${siteUrl}${slug}`;

  const ref = createRef(null);
  const [image, takeScreenshot] = useScreenshot({
    type: "image/png",
    quality: 1.0
  });

  const download = (img, { name = "img", extension = "png" } = {}) => {
    const a = document.createElement("a");
    a.href = img;
    a.download = createFileName(extension, name);
    a.click();
  };

  const downloadScreenshot = () => takeScreenshot(ref.current).then(download);

  // Copy to clipboard would be nice, but browser support is patchy

  return (
    <React.Fragment>
      <Article>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "10px"
          }}
        >
          {url}
          <div ref={ref}>
            <QRCode value={url} />
          </div>
          <button style={button} onClick={downloadScreenshot}>
            Download
          </button>
        </div>
        <div style={{ opacity: 0 }}>
          <img width={"500px"} src={image} alt={"Screenshot"} />
        </div>
      </Article>
    </React.Fragment>
  );
};

QrCodeTemplate.propTypes = {
  pageContext: PropTypes.object.isRequired
};

export default QrCodeTemplate;

// eslint-disable-next-line no-undef
export const postQuery = graphql`
  query MinimalPostBySlug($slug: String!) {
    post: markdownRemark(fields: { slug: { eq: $slug } }) {
      fields {
        title
        slug
      }
    }
  }
`;
