import { FaTag } from "react-icons/fa/";
import PropTypes from "prop-types";
import React from "react";
import { graphql } from "gatsby";
import Seo from "../components/Seo";
import { ThemeContext } from "../layouts";
import Article from "../components/Article";
import Headline from "../components/Article/Headline";
import List from "../components/List";
import { filterOutDrafts } from "../utils/filters";

const CategoryTemplate = props => {
  const {
    pageContext: { category },
    data: {
      allMarkdownRemark: { edges }
    }
  } = props;

  const filteredEntries = filterOutDrafts(edges);
  const totalCount = filteredEntries.length;

  // The display category may vary within the category so just grab it off the first entry
  const displayCategory =
    filteredEntries.length > 0 ? filteredEntries[0].node.fields.displayCategory : category;

  return (
    <React.Fragment>
      <ThemeContext.Consumer>
        {theme => (
          <Article theme={theme}>
            <header>
              <Headline theme={theme}>
                <span>Posts in category</span> <FaTag />
                {displayCategory}
              </Headline>
              <p className="meta">
                There {totalCount > 1 ? "are" : "is"} <strong>{totalCount}</strong> post
                {totalCount > 1 ? "s" : ""} in the category.
              </p>
              <List edges={filteredEntries} theme={theme} />
            </header>
          </Article>
        )}
      </ThemeContext.Consumer>

      <Seo />
    </React.Fragment>
  );
};

CategoryTemplate.propTypes = {
  data: PropTypes.object.isRequired,
  pageContext: PropTypes.object.isRequired
};

export default CategoryTemplate;

// It'd be nice to embed a filter, but everything has to be static - see https://github.com/gatsbyjs/gatsby/issues/5069
// ... so filter the list in code after the query

// eslint-disable-next-line no-undef
export const categoryQuery = graphql`
  query PostsByCategory($category: String) {
    allMarkdownRemark(
      limit: 1000
      sort: { fields: [fields___prefix], order: DESC }
      filter: { fields: { slug: { ne: "" }, category: { eq: $category } } }
    ) {
      edges {
        node {
          fields {
            slug
            prefix
            category
            displayCategory
            title
          }
          frontmatter {
            type
          }
        }
      }
    }
  }
`;
