import PropTypes from "prop-types";
import React, { useState } from "react";
import { graphql } from "gatsby";
import Seo from "../components/Seo";
import Article from "../components/Article";
import Headline from "../components/Article/Headline";
import List from "../components/List/List";
import LogoList from "../components/List/LogoList";
import EventList from "../components/List/EventList";
import { plural, icon } from "../utils/type";
import { filterOutDrafts } from "../utils/filters";
import { useTheme } from "../layouts/theme";

const TypeTemplate = props => {
  const [showEventName, setShowEventName] = useState(true);
  const theme = useTheme();

  const {
    pageContext: { type },
    data: {
      allMarkdownRemark: { edges }
    }
  } = props;

  const showUpcoming = type === "talk";
  const filteredEntries = filterOutDrafts(edges, showUpcoming);

  // Do this filtering here so that it is dynamic, rather than being done at build-time
  const now = new Date().getTime();

  // Create year list
  const years = {};
  filteredEntries.forEach(edge => {
    const {
      node: {
        fields: { prefix }
      }
    } = edge;

    const date = new Date(prefix);

    const isInTheFuture = date.getTime() > now;
    let year;
    year = date.getFullYear();

    if (!year) {
      year = "unpublished";
    }
    if (isInTheFuture) {
      year = "upcoming";
    }

    if (year) {
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
  const useShortDate = yearList.length > 1;

  const flipHeadings = event => {
    if (event.type === "mouseover") {
      setShowEventName(false);
    } else if (event.type === "mouseout") {
      setShowEventName(true);
    }
  };

  const listEntry = (item, type, theme, year, useShortDate) => {
    if (type === "media" || type === "book") {
      return <LogoList edges={item} key={year} />;
    } else if (type === "talk") {
      return (
        <EventList
          edges={item}

          key={year}
          showDate={!showEventName}
          listener={flipHeadings}
        />
      );
    } else {
      return (
        <List edges={item} key={year} showIcon={false} useShortDate={useShortDate} />
      );
    }
  };
  return (
    <React.Fragment>
      <Article>
        <header>
          <Headline>
            {Icon && <Icon />}
            {plural(type)}
          </Headline>
          {yearList.length > 1
            ? yearList.map(item => (
              <section key={item[0]}>
                <h2>{item[0]}</h2>
                {listEntry(item[1], type, theme, item[0], useShortDate)}
              </section>
            ))
            : yearList.map(item => listEntry(item[1], type, theme, item[0]))}
        </header>
      </Article>

      <Seo />
    </React.Fragment>
  );
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
      sort: {fields: {prefix: DESC}}
      filter: {fields: {slug: {ne: ""}}, frontmatter: {type: {eq: $type}}}
    ) {
      totalCount
      edges {
        node {
          fields {
            title
            slug
            prefix
            draft
            shortDate
            geography {
              flag
              country
            }
          }
          frontmatter {
            url
            type
            event
            keynote
            slides {url}
            video {url}
          }
        }
      }
    }
  }
`;
