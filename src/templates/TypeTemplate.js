import PropTypes from "prop-types";
import React from "react";
import { graphql } from "gatsby";
import Seo from "../components/Seo";
import { ThemeContext } from "../layouts";
import Article from "../components/Article";
import Headline from "../components/Article/Headline";
import List from "../components/List/List";
import LogoList from "../components/List/LogoList";
import { plural, icon } from "../utils/type";

const TypeTemplate = props => {
  const {
    pageContext: { type },
    data: {
      allMarkdownRemark: { totalCount, edges }
    }
  } = props;

  const Icon = icon(type);

  return (
    <React.Fragment>
      <ThemeContext.Consumer>
        {theme => (
          <Article theme={theme}>
            <header>
              <Headline theme={theme}>
                {Icon && <Icon />}
                {plural(type)}
              </Headline>
              {type == "media" || type == "book" ? (
                <LogoList edges={edges} theme={theme} />
              ) : (
                <List edges={edges} theme={theme} />
              )}
            </header>
          </Article>
        )}
      </ThemeContext.Consumer>

      <Seo />
    </React.Fragment>
  );
};

TypeTemplate.propTypes = {
  data: PropTypes.object.isRequired,
  pageContext: PropTypes.object.isRequired
};

export default TypeTemplate;

// It'd be nice to use our filters utility, but everything has to be static - see https://github.com/gatsbyjs/gatsby/issues/5069
// ... so just default to not showing draft content in type pages

// eslint-disable-next-line no-undef
export const typeQuery = graphql`
  query PostsByType($type: String) {
    allMarkdownRemark(
      limit: 1000
      sort: { fields: [fields___prefix], order: DESC }
      filter: {
        fields: { slug: { ne: "" }, prefix: { ne: "draft" } }
        frontmatter: { type: { eq: $type } }
      }
    ) {
      totalCount
      edges {
        node {
          fields {
            slug
          }
          excerpt
          timeToRead
          frontmatter {
            url
            title
            type
          }
        }
      }
    }
  }
`;
