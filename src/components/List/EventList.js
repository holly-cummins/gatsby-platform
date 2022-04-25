import React from "react";
import PropTypes from "prop-types";
import { Link } from "gatsby";

const EventList = props => {
  const { edges, theme } = props;

  return (
    <React.Fragment>
      <ul data-testid="event-list-wrapper">
        {edges.map(edge => {
          const {
            node: {
              frontmatter: { title, url, event },
              fields: { slug }
            }
          } = edge;

          return (
            <li key={slug} className="event-list">
              <div className="event">{event}</div>
              <div>
                {url ? (
                  <a href={url} className="link">
                    {title}
                  </a>
                ) : (
                  <Link to={slug}>{title}</Link>
                )}
              </div>
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
          font-size: ${theme.font.size.s};
          line-height: ${theme.font.lineHeight.l};
          display: flex;
          align-items: center;
        }

        .event {
          color: ${theme.color.brand.light};
          padding-right: 10px;
        }
      `}</style>
    </React.Fragment>
  );
};

EventList.propTypes = {
  edges: PropTypes.array.isRequired,
  theme: PropTypes.object.isRequired
};

export default EventList;
