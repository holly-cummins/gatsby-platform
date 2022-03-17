import React from "react";
import PropTypes from "prop-types";
import { Link } from "gatsby";

import { Calendar20 as Calendar } from "@carbon/icons-react";
import { Tag20 as Tag } from "@carbon/icons-react";
import { User20 as User } from "@carbon/icons-react";
import { PresentationFile20 as Talk } from "@carbon/icons-react";

const Meta = props => {
  const { prefix, author: authorName, category, event, theme } = props;

  return (
    <p className="meta">
      <span>
        <Calendar /> {prefix}
      </span>
      {event ? (
        <span>
          <Talk /> {event}
        </span>
      ) : (
        <></>
      )}
      <span>
        <User /> {authorName}
      </span>
      {category && (
        <span>
          <Tag />
          <Link to={`/category/${category.split(" ").join("-")}`}>{category}</Link>
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
  category: PropTypes.string.isRequired,
  theme: PropTypes.object.isRequired
};

export default Meta;
