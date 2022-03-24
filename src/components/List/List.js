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
              fields: { slug, prefix }
            }
          } = edge;

          const Icon = icon(type);
          // Styling the icon is hard without grabbing other svg on the page, so cheat and wrap it in a container

          return (
            <li key={slug} className="post-list">
              <div className="type">{Icon && <Icon />}</div>
              <div className="date">{prefix}</div>
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
          display: flex;
        }
        .date {
          color: ${theme.color.brand.light};
          padding-right: 10px;
        }
        .type {
          position: relative;
          top: 4px;
          left: -10px;
          position: relative;
          top: 4px;
          left: -10px;
          color: ${theme.text.color.primary};
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
