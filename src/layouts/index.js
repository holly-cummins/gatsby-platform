import React from "react";
import { graphql, useStaticQuery } from "gatsby";

import Header from "../components/Header";

export const ScreenWidthContext = React.createContext(0);

import Footer from "../components/Footer";
import { ThemeProvider } from "./theme";

export default function Layout({ children, location }) {

  const path = location.pathname;

  const data = useStaticQuery(graphql`
          query LayoutQuery {
            pages: allMarkdownRemark(
              filter: { fileAbsolutePath: { regex: "//pages//" }, fields: { prefix: { regex: "/^\\d+$/" } } }
              sort: {fields: {prefix: ASC}}
            ) {
              edges {
                node {
                  fields {
                    slug
                    prefix
                  }
                  frontmatter {
                    title
                    menuTitle
                  }
                }
              }
            }
            site {
              siteMetadata {
                algolia {
                  available
                }
              }
            }
          }
        `);

  const {
    pages: { edges: pages },
    site: {
      siteMetadata: {
        algolia: { available: searchAvailable }
      }
    }
  } = data;

  return (
    <ThemeProvider>
      <React.Fragment>
        <Header
          path={path}
          pages={pages}
          searchAvailable={searchAvailable}
        />
        <main>{children}</main>
        <Footer />

        {/* --- STYLES --- */}
        <style jsx>{`
          main {
            min-height: 80vh;
          }
        `}</style>
        <style jsx global>{`
          html {
            box-sizing: border-box;
          }

          *,
          *:after,
          *:before {
            box-sizing: inherit;
            margin: 0;
            padding: 0;
          }

          body {
            font-family: 'Open Sans', 'sans-serif'
          }

          h1,
          h2,
          h3 {
            font-weight: 600;
            line-height: 1.1;
            letter-spacing: -0.03em;
            margin: 0;
          }

          h1 {
            letter-spacing: -0.04em;
            padding-bottom: 1em;
          }

          p {
            margin: 0;
          }

          strong {
            font-weight: 600;
          }

          a {
            text-decoration: none;
            color: #666;
          }

          main {
            width: auto;
            display: block;
          }
        `}</style>
      </React.Fragment>
    </ThemeProvider>
  );
}
