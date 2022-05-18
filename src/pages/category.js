import { Tag20 as Tag } from "@carbon/icons-react";
import PropTypes from "prop-types";
import React from "react";
import { graphql } from "gatsby";

const _ = require("lodash");

import { ThemeContext } from "../layouts";
import Article from "../components/Article/";
import Headline from "../components/Article/Headline";
import List from "../components/List";
import Seo from "../components/Seo";
import { filterOutDrafts } from "../utils/filters";
import config from "../utils/configger";

const CategoryPage = props => {
  const {
    data: {
      posts: { edges: edges }
    }
  } = props;

  const posts = filterOutDrafts(edges);

  // Create category list
  const categories = {};
  posts.forEach(edge => {
    let {
      node: {
        frontmatter: { category }
      }
    } = edge;

    if (category) {
      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push(edge);
    }
  });

  const categoryList = [];

  for (const key in categories) {
    categoryList.push([key, categories[key]]);
  }

  return (
    <React.Fragment>
      <ThemeContext.Consumer>
        {theme => (
          <Article theme={theme}>
            <header>
              <Headline title={`What's ${config.authorShortName} Thinking About?`} theme={theme} />
            </header>
            {categoryList.map(item => (
              <section key={item[0]}>
                <h2>
                  <a href={`/category/${_.kebabCase(item[0])}`}>
                    <Tag />
                    {item[0]}
                  </a>
                </h2>
                <List edges={item[1]} theme={theme} />
              </section>
            ))}
            {/* --- STYLES --- */}
            <style jsx>{`
              h2 {
                margin: 0 0 0.5em;
              }

              h2 :global(svg) {
                height: 0.8em;
                fill: ${theme.color.brand.primary};
                position: relative;
                top: 3px;
                margin-right: 10px;
              }
            `}</style>
          </Article>
        )}
      </ThemeContext.Consumer>

      <Seo />
    </React.Fragment>
  );
};

CategoryPage.propTypes = {
  data: PropTypes.object.isRequired
};

export default CategoryPage;

// It'd be nice to embed a filter, but everything has to be static - see https://github.com/gatsbyjs/gatsby/issues/5069
// ... so filter the list in code after the query

// eslint-disable-next-line no-undef
export const query = graphql`
  query PostsQuery {
    posts: allMarkdownRemark(
      filter: { fileAbsolutePath: { regex: "//(posts|publications|talks)/.*--/" } }
      sort: { fields: [fields___prefix], order: DESC }
    ) {
      edges {
        node {
          excerpt
          fields {
            slug
            prefix
            title
            cover {
              children {
                ... on ImageSharp {
                  gatsbyImageData(width: 800, height: 360, layout: CONSTRAINED)
                }
              }
            }
          }
          frontmatter {
            category
            author
            type
            url
          }
        }
      }
    }
  }
`;
