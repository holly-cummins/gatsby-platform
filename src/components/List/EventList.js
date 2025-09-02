import React from "react";
import PropTypes from "prop-types";
import { Link } from "gatsby";
import { Badge as Star } from "@carbon/icons-react";
import { Video as Video } from "@carbon/icons-react";
import { PresentationFile as Slide } from "@carbon/icons-react";
import { useTheme } from "../../layouts/theme";
import useFitText from "use-fit-text";
import EventTitle from "./EventTitle";

const EventList = props => {
  const { edges, showDate, listener } = props;
  const theme = useTheme();

  return (
    (<React.Fragment>
      <ul data-testid="event-list-wrapper">
        {edges.map(edge => {

          const {
            node: {
              frontmatter: { url, event, keynote, slides, video },
              fields: { slug, shortDate, title, geography }
            }
          } = edge;
          const anchor = (content, id) =>
            url ?
              (<a href={url}>
                  {content}
                </a>
              ) : id ? (
                <Link to={`${slug}#${id}`}>{content}</Link>
              ) : (
                <Link to={slug}>{content}</Link>
              );


          return (
            <li key={slug} className="row">
              <div className="keynoteIndicator">{keynote ? anchor(<Star size={20} />) : <></>}</div>
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
              <EventTitle showDate={showDate} date={shortDate} event={event} listener={listener} />
              <div className="contentIndicator">{slides ?
                anchor(<Slide size={20} />, "slides") : <></>}</div>
              <div className="contentIndicator">{video ? anchor(<Video size={20} />, "video") : <></>}</div>
              {<div className="talkTitle">{anchor(title)}</div>
              }
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
          min-width: 20px;
          max-width: 20px;
          padding-left: 30px;
          padding-right: 20px;
        }

        .contentIndicator {
          min-width: 20px;
          max-width: 20px;
        }

        .flag {
          min-width: 20px;
          max-width: 20px;
          opacity: 80%;
        }

        .talkTitle {
          text-align: left;
          flex: 75%;
          padding-left: 25px;
        }
      `}</style>
    </React.Fragment>)
  );
};

EventList.propTypes = {
  edges: PropTypes.array.isRequired,
  showDate: PropTypes.bool,
  listener: PropTypes.func
};

export default EventList;
