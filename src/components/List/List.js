import React from "react";
import PropTypes from "prop-types";
import { Link } from "gatsby";
import { icon } from "../../utils/type";

const List = props => {
  const { edges, theme } = props;

  return (
    <React.Fragment>
      <ul data-testid="post-list-wrapper">
        {edges.map(edge => {
          const {
            node: {
              frontmatter: { title, url, type },
              fields: { slug }
            }
          } = edge;

          const Icon = icon(type);
          return (
            <li key={slug} className="post-list">
              {Icon && <Icon />}
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
          list-style: none;
        }
        li {
          padding: ${theme.space.xs} 0;
          font-size: ${theme.font.size.s};
          line-height: ${theme.font.lineHeight.l};
        }
        :global(svg) {
          position: relative;
          top: 4px;
          left: -10px;
          fill: ${theme.text.color.primary};
          stroke-width: 40;
          animation-duration: ${theme.time.duration.long};
          animation-name: buttonIconMove;
          animation-iteration-count: infinite;
        }
      `}</style>
    </React.Fragment>
  );
};

List.propTypes = {
  edges: PropTypes.array.isRequired,
  theme: PropTypes.object.isRequired
};

export default List;
