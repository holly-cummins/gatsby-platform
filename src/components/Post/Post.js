import React from "react";
import PropTypes from "prop-types";
import "prismjs/themes/prism-okaidia.css";

import Headline from "../Article/Headline";
import Bodytext from "../Article/Bodytext";
import Meta from "./Meta";
import Author from "./Author";
import NextPrev from "./NextPrev";
import Share from "./Share";

const Post = props => {
  const {
    post,
    post: {
      html,
      fields: { title, prefix, author, category, displayCategory }
    },
    authornote,
    next: nextPost,
    prev: prevPost
  } = props;

  return (
    <React.Fragment>
      <header>
        <Headline title={title} />
        <Meta
          prefix={prefix}
          author={author}
          category={category}
          displayCategory={displayCategory}

        />
      </header>
      <Bodytext html={html} />
      <footer>
        <Share post={post} />
        <Author note={authornote} />
        <NextPrev next={nextPost} prev={prevPost} />
      </footer>
    </React.Fragment>
  );
};

Post.propTypes = {
  post: PropTypes.object.isRequired,
  authornote: PropTypes.string.isRequired,
  next: PropTypes.object,
  prev: PropTypes.object

};

export default Post;
