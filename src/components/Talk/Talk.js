import React from "react";
import PropTypes from "prop-types";
import "prismjs/themes/prism-okaidia.css";

import asyncComponent from "../AsyncComponent";
import Headline from "../Article/Headline";
import Meta from "../Post/Meta";
import Author from "../Post/Author";
import NextPrev from "../Post/NextPrev";

const Share = asyncComponent(() =>
  import("../Post/Share")
    .then(module => {
      return module.default;
    })
    .catch(error => {})
);

const Talk = props => {
  const {
    post,
    post: {
      fields: { prefix },
      frontmatter: { title, author, category, event, video }
    },
    authornote,
    next: nextPost,
    prev: prevPost,
    theme
  } = props;

  const videoComponent = () => {
    if (video && video.html) {
      return (
        <React.Fragment>
          {video.title}
          <div className="video" dangerouslySetInnerHTML={{ __html: video.html }} />
        </React.Fragment>
      );
    }
  };

  return (
    <React.Fragment>
      <header>
        <Headline title={title} theme={theme} />
        <Meta prefix={prefix} event={event} author={author} category={category} theme={theme} />
      </header>
      {videoComponent()}

      <footer>
        <Share post={post} theme={theme} />
        <Author note={authornote} theme={theme} />
        <NextPrev next={nextPost} prev={prevPost} theme={theme} />
      </footer>
    </React.Fragment>
  );
};

Talk.propTypes = {
  post: PropTypes.object.isRequired,
  authornote: PropTypes.string.isRequired,
  next: PropTypes.object,
  prev: PropTypes.object,
  theme: PropTypes.object.isRequired
};

export default Talk;
