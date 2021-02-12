import React from "react";
import PropTypes from "prop-types";
import Helmet from "react-helmet";
import config from "../../../content/meta/config";

const Seo = props => {
  const { data } = props;

  // The cover path usually is buried in a childImageSharp structure, but don't assume it always will be
  let postCover;
  if ((((data || {}).frontmatter || {}).cover || {}).childImageSharp) {
    postCover = (data.frontmatter.cover.childImageSharp.resize || {}).src;
  } else {
    postCover = ((data || {}).frontmatter || {}).cover;
  }
  const postTitle = ((data || {}).frontmatter || {}).title;
  const postDescription = (data || {}).excerpt || ((data || {}).frontmatter || {}).description;
  const postSlug = ((data || {}).fields || {}).slug;

  const title = postTitle ? `${postTitle} - ${config.shortSiteTitle}` : config.siteTitle;
  const description = postDescription ? postDescription : config.siteDescription;
  const image = postCover ? postCover : config.siteImage;
  const url = config.siteUrl + config.pathPrefix + postSlug;

  return (
    <Helmet
      htmlAttributes={{
        lang: config.siteLanguage,
        prefix: "og: http://ogp.me/ns#"
      }}
    >
      {/* General tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {/* OpenGraph tags */}
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:type" content="website" />
      {/* Twitter Card tags */}
      <meta name="twitter:card" content="summary" />
      <meta
        name="twitter:creator"
        content={config.authorTwitterAccount ? config.authorTwitterAccount : ""}
      />
    </Helmet>
  );
};

Seo.propTypes = {
  data: PropTypes.object
};

export default Seo;
