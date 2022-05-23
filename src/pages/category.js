import { Tag20 as Tag } from "@carbon/icons-react";
import PropTypes from "prop-types";
import React from "react";
import { graphql } from "gatsby";

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
  const displayCategories = {};
  posts.forEach(edge => {
    let {
      node: {
        fields: { category, displayCategory }
      }
    } = edge;

    if (category) {
      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push(edge);
      // There may be variation in display categories, so just take the first one
      displayCategories[category] = displayCategory;
    }
  });

  return (
    <React.Fragment>
      <ThemeContext.Consumer>
        {theme => (
          <Article theme={theme}>
            <header>
              <Headline title={`What's ${config.authorShortName} Thinking About?`} theme={theme} />
            </header>
            {Object.keys(categories).map(category => (
              <section key={category}>
                <h2>
                  <a href={`/category/${category}`}>
                    <Tag />
                    {displayCategories[category]}
                  </a>
                </h2>
                <List edges={categories[category]} theme={theme} />
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
            category
            displayCategory
            cover {
              children {
                ... on ImageSharp {
                  gatsbyImageData(width: 800, height: 360, layout: CONSTRAINED)
                }
              }
            }
          }
          frontmatter {
            author
            type
            url
          }
        }
      }
    }
  }
`;
