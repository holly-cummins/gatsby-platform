import { FaArrowRight as ArrowRight } from "react-icons/fa/";
import { Calendar20 as Calendar } from "@carbon/icons-react";
import { Tag20 as Tag } from "@carbon/icons-react";
import { User20 as User } from "@carbon/icons-react";

import { GatsbyImage } from "gatsby-plugin-image";
import { Link } from "gatsby";
import PropTypes from "prop-types";
import React from "react";

import { icon } from "../../utils/type";

const Item = props => {
  const {
    theme,
    post: {
      excerpt,
      fields: {
        slug,
        prefix,
        title,
        cover: {
          children: [{ gatsbyImageData }]
        }
      },
      frontmatter: { url, category, type, author }
    }
  } = props;

  const Icon = icon(type);
  const linkContent = (
    <>
      <div className="gatsby-image-outer-wrapper">
        <GatsbyImage image={gatsbyImageData} />
      </div>
      <h1>
        {title} <ArrowRight className="arrow" />
      </h1>
      <p className="meta">
        {type && (
          <span>
            {Icon && <Icon />} {type}
          </span>
        )}
        <span>
          <Calendar /> {prefix}
        </span>
        <span>
          <User /> {author}
        </span>
        {category && (
          <span>
            <Tag /> {category}
          </span>
        )}
      </p>
      <p>{excerpt}</p>
      <style jsx>{`
        :global(.link) {
          width: 100%;
          color: ${theme.text.color.primary};
        }

        h1 {
          padding: ${theme.space.m} ${theme.space.s} 0;
          line-height: ${theme.blog.h1.lineHeight};
          font-size: ${theme.blog.h1.size};
          text-remove-gap: both;

          :global(.arrow) {
            display: none;
            position: relative;
            top: 7px;
          }
        }

        .meta {
          display: flex;
          flex-flow: row wrap;
          font-size: 0.8em;
          padding: ${theme.space.m} ${theme.space.s};
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

        p {
          line-height: 1.5;
          padding: 0 ${theme.space.s};
          text-remove-gap: both;
        }

        @from-width tablet {
          h1 {
            font-size: ${`calc(${theme.blog.h1.size} * 1.2)`};
            padding: ${`calc(${theme.space.default} * 1.5) ${theme.space.default} 0`};
            transition: all 0.5s;
          }

          .meta {
            padding: ${`calc(${theme.space.m} * 1.5) ${theme.space.m}`};
          }

          p {
            padding: 0 ${theme.space.default};
          }
        }
        @from-width desktop {
          :global(.blogItemLink:first-child) > li::before {
            top: ${`calc(${theme.space.default} * -2.75)`};
          }

          h1 {
            font-size: 2.5em;
            padding: ${`calc(${theme.space.default} * 1.2) calc(${theme.space.default} * 2) 0`};
          }

          .meta {
            padding: ${`calc(${theme.space.default} * 1.5) calc(${theme.space.default} * 2)
              calc(${theme.space.default} * 0.5)`};
          }

          p {
            padding: ${`0 calc(${theme.space.default} * 2)`};
          }

          :global(.gatsby-image-wrapper) {
            transition: all ${theme.time.duration.default};
          }

          :global(.arrow) {
            display: inline-block;
            fill: ${theme.color.special.attention};
            stroke: ${theme.color.special.attention};
            stroke-width: 40;
            stroke-linecap: round;
            opacity: 0;
            transition: all 0.5s;
            transform: translateX(-50%);
          }
        }
      `}</style>
    </>
  );

  const link = url ? (
    <a href={url} className="link">
      {linkContent}
    </a>
  ) : (
    <Link to={slug} key={slug} className="link">
      {linkContent}
    </Link>
  );

  return (
    <React.Fragment>
      <li className="blog-item">{link}</li>

      {/* --- STYLES --- */}

      <style jsx>{`
        li {
          border: 1px solid transparent;
          border-radius: ${theme.size.radius.default};
          margin: ${`calc(${theme.space.default} * 2) 0 calc(${theme.space.default} * 3)`};
          padding: ${theme.space.inset.s};
          position: relative;
          transition: all ${theme.time.duration.default};
          background: transparent;

          :global(.gatsby-image-outer-wrapper) {
            border-radius: ${theme.size.radius.default};
            border: 1px solid ${theme.line.color};
            overflow: hidden;
          }

          :global(.gatsby-image-outer-wrapper img) {
            z-index: -1;
          }

          &::after {
            border-top: 1px solid ${theme.line.color};
            content: "";
            height: 0;
            position: absolute;
            bottom: ${`calc(${theme.space.default} * -1.5)`};
            left: 50%;
            transform: translateX(-50%);
            transition: all ${theme.time.duration.default};
            width: 50%;
          }

          &:first-child {
            &::before {
              border-top: 1px solid ${theme.line.color};
              content: "";
              height: 0;
              position: absolute;
              top: ${`calc(${theme.space.default} * -1.5)`};
              left: 50%;
              transform: translateX(-50%);
              transition: all ${theme.time.duration.default};
              width: 50%;
            }
          }
        }

        @from-width tablet {
          li {
            margin: ${`calc(${theme.space.default} * 3) 0 calc(${theme.space.default} * 4)`};
            padding: ${theme.space.default};

            &::after {
              bottom: ${`calc(${theme.space.default} * -2)`};
            }

            &:first-child {
              &::before {
                top: ${`calc(${theme.space.default} * -1.75)`};
              }
            }
          }
        }
        @from-width desktop {
          li {
            margin: ${`calc(${theme.space.default} * 4) 0 calc(${theme.space.default} * 5)`};
            padding: 0 0 ${`calc(${theme.space.default} * 2)`};

            &::after {
              bottom: ${`calc(${theme.space.default} * -1.5)`};
            }

            &:first-child {
              &::before {
                top: ${`calc(${theme.space.default} * -2.75)`};
              }
            }
          }

          :global(.blogItemLink:first-child) > li::before {
            top: ${`calc(${theme.space.default} * -2.75)`};
          }

          li {
            &:hover {
              border: 1px solid ${theme.line.color};
              box-shadow: 0px 3px 2px rgba(0, 0, 0, 0.03);

              &:after {
                bottom: ${`calc(${theme.space.default} * -2.5)`};
              }

              :global(.gatsby-image-wrapper) {
                transform: scale(1.1);
              }

              h1 {
                color: ${theme.blog.h1.hoverColor};
              }

              :global(.arrow) {
                opacity: 1;
                stroke: ${theme.color.special.attention};
                transform: translateX(0);
              }
            }
          }
        }
      `}</style>
    </React.Fragment>
  );
};

Item.propTypes = {
  post: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

export default Item;
