import React from "react";
import PropTypes from "prop-types";
import "prismjs/themes/prism-okaidia.css";

import asyncComponent from "../AsyncComponent";
import Headline from "../Article/Headline";
import Bodytext from "../Article/Bodytext";
import Meta from "../Post/Meta";
import Author from "../Post/Author";
import NextPrev from "../Post/NextPrev";
import Slides from "./Slides";
import Video from "./Video";

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
      html,
      fields: { prefix },
      frontmatter: { title, author, category, event, video, slides }
    },
    authornote,
    next: nextPost,
    prev: prevPost,
    theme
  } = props;

  return (
    <React.Fragment>
      <header>
        <Headline title={title} theme={theme} />
        <Meta prefix={prefix} event={event} author={author} category={category} theme={theme} />
      </header>
      <Bodytext html={html} theme={theme} />
      <div className="separator"></div>
      <Slides slides={slides} theme={theme} />
      <div className="separator"></div>

      <Video video={video} theme={theme} />
      <footer>
        <Share post={post} theme={theme} />
        <Author note={authornote} theme={theme} />
        <NextPrev next={nextPost} prev={prevPost} theme={theme} />
      </footer>

      {/* --- STYLES --- */}

      <style jsx>{`
        .separator {
          border-top: 1px solid ${theme.line.color};
          content: "";
          transition: all ${theme.time.duration.default};
          width: 50%;
          margin-left: auto;
          margin-right: auto;
          margin-bottom: ${theme.space.default};
        }
      `}</style>
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
