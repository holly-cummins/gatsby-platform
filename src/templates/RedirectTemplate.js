import PropTypes from "prop-types";
import React from "react";
import Seo from "../components/Seo";
import { ThemeContext } from "../layouts";
import { Helmet } from "react-helmet";

const RedirectTemplate = props => {
  const {
    pageContext: { url }
  } = props;

  return (
    <React.Fragment>
      <p>Redirecting to {url}</p>

      <Seo />
      <Helmet>
        <meta httpEquiv="refresh" content={`0; url=${url}`} />
      </Helmet>
    </React.Fragment>
  );
};

RedirectTemplate.propTypes = {
  pageContext: PropTypes.object.isRequired
};

export default RedirectTemplate;
