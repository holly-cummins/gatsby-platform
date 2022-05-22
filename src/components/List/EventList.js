import React from "react";
import PropTypes from "prop-types";
import ScaleText from "react-scale-text";
import { Link } from "gatsby";
import { Badge20 as Star } from "@carbon/icons-react";

const EventList = props => {
  const { edges, theme, showDate, listener } = props;

  return (
    <React.Fragment>
      <ul data-testid="event-list-wrapper">
        {edges.map(edge => {
          const {
            node: {
              frontmatter: { url, event, keynote },
              fields: { slug, shortDate, title, geography }
            }
          } = edge;
          // Make sure we don't have a null hanging around in the date
          // since scaledtext does not like nulls
          const cleanDate = shortDate ? shortDate : "..";

          const divs = (
            <div className="row">
              <div className={"flag"}>
                {geography && geography.flag ? (
                  <img
                    src={`data:image/svg+xml;base64,${geography.flag}`}
                    alt={`the flag of ${geography.country}`}
                  />
                ) : (
                  <></>
                )}
              </div>
              <div className="event" onMouseOver={listener} onMouseOut={listener}>
                {/* We can't use the theme here because scaletext needs pixels, not em */}
                <ScaleText maxFontSize={18} minFontSize={6}>
                  {showDate ? cleanDate : event}
                </ScaleText>
              </div>
              <div className="keynoteIndicator">{keynote ? <Star /> : <></>}</div>
              <div className="talkTitle">{title}</div>
            </div>
          );

          return (
            <li key={slug} className="event-list">
              {url ? (
                <a href={url} className="link">
                  {divs}
                </a>
              ) : (
                <Link to={slug}>{divs}</Link>
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
          font-size: ${theme.font.size.s};
          line-height: ${theme.font.lineHeight.l};
        }

        .row {
          display: flex;
          justify-content: flex-start;
          align-items: flex-start;
          gap: 10px;
          padding-bottom: 20px;
        }

        .keynoteIndicator {
          width: 20px;
        }

        .flag {
          width: 20px;
          opacity: 80%;
        }

        .event {
          color: ${theme.color.brand.light};
          width: 170px;
          height: 40px;
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
