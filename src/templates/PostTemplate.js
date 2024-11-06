import PropTypes from "prop-types";
import React from "react";
import { graphql } from "gatsby";

require("prismjs/themes/prism-okaidia.css");

import Seo from "../components/Seo";
import Article from "../components/Article";
import Post from "../components/Post";
import Talk from "../components/Talk";
import { useTheme } from "../layouts/theme";

const PostTemplate = props => {
  const {
    data: {
      post,
      authornote: { html: authorNote }
    },
    pageContext: { next, prev }
  } = props;

  const theme = useTheme();

  return (
    <React.Fragment>
      <Article>
        {post.frontmatter.type === "talk" ? (
          <Talk post={post} next={next} prev={prev} authornote={authorNote} theme={theme} />
        ) : (
          <Post post={post} next={next} prev={prev} authornote={authorNote} theme={theme} />
        )}
      </Article>

      <Seo data={post} />
    </React.Fragment>
  );
};

PostTemplate.propTypes = {
  data: PropTypes.object.isRequired,
  pageContext: PropTypes.object.isRequired
};

export default PostTemplate;

// eslint-disable-next-line no-undef
export const postQuery = graphql`
  query PostBySlug($slug: String!) {
    post: markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      html
      excerpt
      fields {
        title
        slug
        prefix
        shortDate
        category
        author
        displayCategory
        geography {
          flag
          country
        }
        video {
          title
          html
          url
        }
        slides {
          title
          html
          url
        }
        oembeds {
          title
          html
          url
        }
        cover {
          childImageSharp {
            resize(width: 300) {
              src
            }
          }
        }
      }
      frontmatter {
        type
        event
        keynote
        code {
          title
          url
        }
        resources {
          title
          url
          type
        }
      }
    }
    authornote: markdownRemark(fileAbsolutePath: { regex: "/author/" }) {
      id
      html
    }
  }
`;
