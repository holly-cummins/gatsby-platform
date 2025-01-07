import React from "react";
import PropTypes from "prop-types";
import { Link } from "gatsby";

import { Calendar } from "@carbon/icons-react";
import { Tag } from "@carbon/icons-react";
import { User } from "@carbon/icons-react";
import { PresentationFile as Talk } from "@carbon/icons-react";
import { Badge as Star } from "@carbon/icons-react";
import { useTheme } from "../../layouts/theme";

const Meta = props => {
  const { prefix, author: authorName, category, displayCategory, event, keynote } = props;
  const theme = useTheme();

  return (
    <p className="meta">
      <span>
        <Calendar size={20} /> {prefix}
      </span>
      {event ? (
        <span>
          <Talk size={20} /> {event}
        </span>
      ) : (
        <></>
      )}
      {keynote ? (
        <span>
          <Star size={20} /> keynote
        </span>
      ) : (
        <></>
      )}
      <span>
        <User size={20} /> {authorName}
      </span>
      {category && (
        <span>
          <Tag size={20} />
          <Link to={`/category/${category}`}>{displayCategory}</Link>
        </span>
      )}

      {/* --- STYLES --- */}
      <style jsx>{`
        .meta {
          display: flex;
          flex-flow: row wrap;
          font-size: 0.8em;
          margin: ${theme.space.m} 0;
          background: transparent;

          :global(svg) {
            fill: ${theme.icon.color};
            margin: ${theme.space.inline.xs};
          }

          span {
            align-items: center;
            display: flex;
            text-transform: uppercase;
            margin: ${theme.space.xs} ${theme.space.s} ${theme.space.xs} 0;
          }
        }

        @from-width tablet {
          .meta {
            margin: ${`calc(${theme.space.m} * 1.5) 0 ${theme.space.m}`};
          }
        }
      `}</style>
    </p>
  );
};

Meta.propTypes = {
  prefix: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  event: PropTypes.string,
  keynote: PropTypes.bool,
  category: PropTypes.string.isRequired,
  displayCategory: PropTypes.string.isRequired,

};

export default Meta;
