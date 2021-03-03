import React from "react";
import PropTypes from "prop-types";
import { Link } from "gatsby";

const LogoList = props => {
  const { edges, theme } = props;

  return (
    <React.Fragment>
      <ul data-testid="logo-list-wrapper">
        {edges.map(edge => {
          const {
            node: {
              frontmatter: { title, url },
              fields: { slug }
            }
          } = edge;

          return (
            <li key={slug} className="post-list">
              {url ? (
                <a href={url} className="link">
                  {title}
                </a>
              ) : (
                <Link to={slug}>{title}</Link>
              )}
            </li>
          );
        })}
      </ul>

      {/* --- STYLES --- */}
      <style jsx>{`
        ul {
          margin: ${theme.space.stack.m};
          padding: ${theme.space.m};
          list-style: circle;
        }
        li {
          padding: ${theme.space.xs} 0;
          font-size: ${theme.font.size.s};
          line-height: ${theme.font.lineHeight.l};
        }
      `}</style>
    </React.Fragment>
  );
};

LogoList.propTypes = {
  edges: PropTypes.array.isRequired,
  theme: PropTypes.object.isRequired
};

export default LogoList;
