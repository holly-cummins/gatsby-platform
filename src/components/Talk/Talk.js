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
import Code from "./Code";
import EmbeddedResources from "./EmbeddedResources";

const Share = asyncComponent(() =>
  import("../Post/Share")
    .then(module => {
      return module.default;
    })
    .catch(_ => {})
);

const Talk = props => {
  const {
    post,
    post: {
      html,
      fields: { prefix, title, video, slides, oembeds, author, category, displayCategory },
      frontmatter: { event, keynote, code }
    },
    authornote,
    next: nextPost,
    prev: prevPost,
    theme
  } = props;

  return (
    <div>
      <header>
        <Headline title={title} theme={theme} />
        <Meta
          prefix={prefix}
          event={event}
          author={author}
          category={category}
          displayCategory={displayCategory}
          keynote={keynote}
          theme={theme}
        />
      </header>
      <Bodytext html={html} theme={theme} />
      <Slides slides={slides} theme={theme} />
      <Video video={video} theme={theme} />
      <Code code={code} theme={theme} />
      <EmbeddedResources oembeds={oembeds} theme={theme} />

      <footer>
        <Share post={post} theme={theme} />
        <Author note={authornote} theme={theme} />
        <NextPrev next={nextPost} prev={prevPost} theme={theme} />
      </footer>
    </div>
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
