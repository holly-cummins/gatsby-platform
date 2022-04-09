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
import { filterOutDrafts } from "../utils/filters";

const TypeTemplate = props => {
  const {
    pageContext: { type },
    data: {
      allMarkdownRemark: { totalCount, edges }
    }
  } = props;

  const filteredEntries = filterOutDrafts(edges);

  // Create year list
  const years = {};
  filteredEntries.forEach(edge => {
    const {
      node: {
        fields: { prefix }
      }
    } = edge;

    let year;
    year = new Date(prefix).getFullYear();

    if (!year) {
      year = "unpublished";
    }

    if (year && year != null) {
      if (!years[year]) {
        years[year] = [];
      }
      years[year].push(edge);
    }
  });

  let yearList = Object.entries(years);
  // Make sure we are sorted within each year as well
  yearList = yearList.map(entry => [
    entry[0],
    entry[1]
      .sort((a, b) => new Date(a.node.fields.prefix) - new Date(b.node.fields.prefix))
      .reverse()
  ]);

  // ... and sort by year
  yearList.sort().reverse();

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
              {yearList.length > 1
                ? yearList.map(item => (
                    <section key={item[0]}>
                      <h2>{item[0]}</h2>
                      {listEntry(item[1], type, theme, item[0])}
                    </section>
                  ))
                : yearList.map(item => listEntry(item[1], type, theme, item[0]))}
            </header>
          </Article>
        )}
      </ThemeContext.Consumer>

      <Seo />
    </React.Fragment>
  );
};

const listEntry = (item, type, theme, year) => {
  if (type == "media" || type == "book") {
    return <LogoList edges={item} theme={theme} key={year} />;
  } else {
    return <List edges={item} theme={theme} key={year} />;
  }
};

TypeTemplate.propTypes = {
  data: PropTypes.object.isRequired,
  pageContext: PropTypes.object.isRequired
};

export default TypeTemplate;

// It'd be nice to embed a filter, but everything has to be static - see https://github.com/gatsbyjs/gatsby/issues/5069
// ... so filter the list in code after the query

// eslint-disable-next-line no-undef
export const typeQuery = graphql`
  query PostsByType($type: String) {
    allMarkdownRemark(
      limit: 1000
      sort: { fields: [fields___prefix], order: DESC }
      filter: { fields: { slug: { ne: "" } }, frontmatter: { type: { eq: $type } } }
    ) {
      totalCount
      edges {
        node {
          fields {
            slug
            prefix
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
