import { graphql, Link, useStaticQuery } from "gatsby";
import PropTypes from "prop-types";
import React, { useState } from "react";
import VisibilitySensor from "react-visibility-sensor";

import { ScreenWidthContext } from "../../layouts";
import config from "../../utils/configger";
import Menu from "../Menu";
import { useTheme } from "../../layouts/theme";

export const PureHeader = (props) => {
  const {
    pages,
    path,
    data: {
      file: { publicURL: avatar }
    }
  } = props;

  const [fixed, setFixed] = useState(false);
  const theme = useTheme();

  const visibilitySensorChange = val => {
    if (val) {
      setFixed(false);
    } else {
      setFixed(true);
    }
  };

  const getHeaderSize = () => {
    const fixedString = fixed ? "fixed" : "";
    const homepage = path === "/" ? "homepage" : "";

    return `${fixedString} ${homepage}`;
  };

  return (
    <React.Fragment>
      <header className={`header ${getHeaderSize()}`}>
        <Link to="/" className="logoType">
          <div className="logo">
            <img
              src={config.gravatarImgMd5 === "" ? avatar : config.gravatarImgMd5}
              alt={config.siteTitle}
            />
          </div>
          <div className="type">
            <h1>{config.headerTitle}</h1>
            <h2>{config.headerSubTitle}</h2>
          </div>
        </Link>
        <ScreenWidthContext.Consumer>
          {width => (
            <Menu
              path={path}
              fixed={fixed}
              screenWidth={width}
              pages={pages}

              searchAvailable={props.searchAvailable}
            />
          )}
        </ScreenWidthContext.Consumer>
      </header>
      <VisibilitySensor onChange={visibilitySensorChange}>
        <div className="sensor" />
      </VisibilitySensor>

      {/* --- STYLES --- */}
      <style jsx>{`
        .header {
          align-items: center;
          justify-content: center;
          background-color: ${theme.color.neutral.white};
          display: flex;
          height: ${theme.header.height.default};
          position: relative;
          top: 0;
          width: 100%;

          :global(a.logoType) {
            align-items: center;
            display: flex;
            flex-direction: column;
            color: ${theme.text.color.primary};

            .logo {
              flex-shrink: 0;
            }
          }

          &.homepage {
            position: absolute;
            background-color: transparent;
            height: ${theme.header.height.homepage};
          }
        }

        h1 {
          font-size: ${theme.font.size.m};
          font-weight: ${theme.font.weight.standard};
          margin: ${theme.space.stack.xs};
        }

        h2 {
          font-weight: ${theme.font.weight.standard};
          font-size: ${theme.font.size.xxs};
          letter-spacing: 0;
          margin: 0;
        }

        .logo {
          border-radius: 65% 75%;
          border: 1px solid #eee;
          display: inline-block;
          height: 44px;
          margin: ${theme.space.inline.default};
          overflow: hidden;
          width: 44px;
          transition: all 0.5s;

          .homepage & {
            height: 60px;
            width: 60px;
          }

          img {
            width: 100%;
          }
        }

        .sensor {
          display: block;
          position: absolute;
          bottom: 0;
          z-index: 1;
          left: 0;
          right: 0;
          height: 1px;
          top: ${path === "/" ? theme.header.height.homepage : theme.header.height.default};
        }

        @from-width tablet {
          .header {
            padding: ${theme.space.inset.l};

            &.homepage {
              height: ${theme.header.height.homepage};
            }
          }
        }

        @below desktop {
          .header.homepage {
            .logo {
              border: none;
            }

            :global(a.logoType),
            h1 {
              color: ${theme.color.neutral.white};
            }

            h2 {
              color: ${theme.color.neutral.gray.d};
            }
          }
        }

        @from-width desktop {
          .header {
            align-items: center;
            background-color: ${theme.color.neutral.white};
            display: flex;
            position: absolute;
            top: 0;
            width: 100%;
            justify-content: space-between;
            transition: padding 0.5s;

            &.fixed {
              height: ${theme.header.height.fixed};
              background-color: ${theme.color.neutral.white};
              left: 0;
              padding: 0 ${theme.space.m};
              position: fixed;
              top: 0;
              width: 100%;
              z-index: 1;

              h1 {
                margin: ${theme.space.stack.xxs};
              }

              h2 {
                display: none;
              }
            }

            &.homepage:not(.fixed) {
              :global(a.logoType),
              h1 {
                color: ${theme.color.neutral.white};
              }

              h2 {
                color: ${theme.color.neutral.gray.d};
              }
            }
          }

          .header :global(a.logoType) {
            text-align: left;
            flex-direction: row;
            flex-shrink: 0;
            width: auto;
          }

          .logo {
            margin: ${theme.space.inline.default};

            .fixed & {
              height: 36px;
              width: 36px;
            }

            .header.homepage:not(.fixed) & {
              border: none;
            }
          }

          h2 {
            animation-duration: ${theme.time.duration.default};
            animation-name: h2Entry;
          }

          @keyframes h2Entry {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
        }
      `}</style>
    </React.Fragment>
  );
};

export default function Header(props) {
  // The image could be in ./content or ../content, so use a query
  const data = useStaticQuery(graphql`
        query HeaderAuthorQuery {
          file(base: { eq: "author.jpg" }) {
            publicURL
          }
        }
      `);

  return (<PureHeader data={data} {...props} />);
}

PureHeader.propTypes = {
  pages: PropTypes.array.isRequired,
  path: PropTypes.string.isRequired,
  data: PropTypes.shape({
    file: PropTypes.shape({
      publicURL: PropTypes.string.isRequired
    })
  })
}
;
