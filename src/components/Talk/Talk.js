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
import Resources from "./Resources";

const Share = asyncComponent(() =>
  import("../Post/Share")
    .then(module => {
      return module.default;
    })
    .catch(_ => {
    })
);

const Talk = props => {
  const {
    post,
    post: {
      html,
      fields: { prefix, title, video, slides, oembeds, author, category, displayCategory },
      frontmatter: { event, keynote, code, resources }
    },
    authornote,
    next: nextPost,
    prev: prevPost
  } = props;

  return (
    <div>
      <header>
        <Headline title={title} />
        <Meta
          prefix={prefix}
          event={event}
          author={author}
          category={category}
          displayCategory={displayCategory}
          keynote={keynote}

        />
      </header>
      <Bodytext html={html} />
      <Slides slides={slides} />
      <Video video={video} />
      <Code code={code} />
      <Resources resources={resources} />
      <EmbeddedResources oembeds={oembeds} />

      <footer>
        <Share post={post} />
        <Author note={authornote} />
        <NextPrev next={nextPost} prev={prevPost} />
      </footer>
    </div>
  );
};

Talk.propTypes = {
  post: PropTypes.object.isRequired,
  authornote: PropTypes.string.isRequired,
  next: PropTypes.object,
  prev: PropTypes.object

};

export default Talk;
