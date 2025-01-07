import PropTypes from "prop-types";
import React from "react";
import { graphql } from "gatsby";
import Blog from "../components/Blog";
import Hero from "../components/Hero";
import Seo from "../components/Seo";

import { filterOutDrafts } from "../utils/filters";
import config from "../utils/configger";

const platforms = config.authorSocialLinks;

export const Head = () => {
  return (
    <>
      {
        platforms.map(platform => (
          <link rel="me" href={platform.url} key={platform.name} />
        ))
      }</>
  );
};

export default function IndexPage({ data }) {
  const separator = React.createRef();

  const scrollToContent = () => {
    separator.current.scrollIntoView({ block: "start", behavior: "smooth" });
  };

  const {
    entries: { edges: entries = [] },
    heroes: { edges: heroFiles = [] }
  } = data;

  let isContentOutsideMainSourceStructure = false;
  if (heroFiles?.length > 0) {
    const heroPath = heroFiles[0].node.dir;
    // Crude hack to work out if the content directory is above the main src structure
    isContentOutsideMainSourceStructure =
      heroPath && !heroPath.includes("gatsby-platform/content");
  }

  const filteredEntries = filterOutDrafts(entries);

  return (
    <React.Fragment>
      <Hero
        scrollToContent={scrollToContent}
        isContentOutsideMainSourceStructure={isContentOutsideMainSourceStructure}
      />

      <hr ref={separator} />

      <Blog posts={filteredEntries} />

      <Seo />

      <style jsx>{`
        hr {
          margin: 0;
          border: 0;
        }
      `}</style>
    </React.Fragment>
  );
}


IndexPage.propTypes = {
  data: PropTypes.object.isRequired
};

// eslint-disable-next-line no-undef
export const query = graphql`
query IndexQuery {
  entries: allMarkdownRemark(
    filter: {fileAbsolutePath: {regex: "//(posts|publications|talks)/.*--/"}}
    sort: {fields: {prefix: DESC}}
  ) {
    edges {
      node {
        excerpt
        fields {
          slug
          prefix
          draft
          author
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
          url
          type
        }
      }
    }
  }
  heroes: allFile(filter: {absolutePath: {regex: "/hero-background/"}}) {
    edges {
      node {
        dir
      }
    }
  }
}
`;
