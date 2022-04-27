import React from "react";
import PropTypes from "prop-types";
import { Link } from "gatsby";

const EventList = props => {
  const { edges, theme, showDate, listener } = props;

  return (
    <React.Fragment>
      <ul data-testid="event-list-wrapper">
        {edges.map(edge => {
          const {
            node: {
              frontmatter: { title, url, event },
              fields: { slug, shortDate }
            }
          } = edge;

          return (
            <li key={slug} className="event-list">
              <div className="event" onMouseOver={listener} onMouseOut={listener}>
                {showDate ? shortDate : event}
              </div>
              <div className={"talkTitle"}>
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
          justify-content: flex-start;
          align-items: flex-start;
          gap: 10px;
          padding-bottom: 20px;
        }

        .event {
          color: ${theme.color.brand.light};
          width: 170px;
          flex: 25%;
        }

        .talkTitle {
          text-align: left;
          flex: 75%;
        }
      `}</style>
    </React.Fragment>
  );
};

EventList.propTypes = {
  edges: PropTypes.array.isRequired,
  theme: PropTypes.object.isRequired,
  showDate: PropTypes.bool,
  listener: PropTypes.func
};

export default EventList;
