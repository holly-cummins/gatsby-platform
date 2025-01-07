import React from "react";
import PropTypes from "prop-types";

import config from "../../utils/configger";
import { graphql, StaticQuery } from "gatsby";
import { useTheme } from "../../layouts/theme";

export const Author = props => {
  const {
    note,
    data: {
      file: { publicURL: avatar }
    }
  } = props;

  const theme = useTheme();


  return (
    <React.Fragment>
      <div className="author">
        <div className="avatar">
          <img
            src={config.gravatarImgMd5 === "" ? avatar : config.gravatarImgMd5}
            alt={config.siteTitle}
          />
        </div>
        <div className="note" dangerouslySetInnerHTML={{ __html: note }} />
      </div>

      {/* --- STYLES --- */}
      <style jsx>{`
        .author {
          margin: ${theme.space.l} 0;
          padding: ${theme.space.l} 0;
          border-top: 1px solid ${theme.line.color};
          border-bottom: 1px solid ${theme.line.color};
        }

        .avatar {
          float: left;
          border-radius: 65% 75%;
          border: 1px solid ${theme.line.color};
          display: inline-block;
          height: 50px;
          margin: 5px 20px 0 0;
          overflow: hidden;
          width: 50px;
        }

        .avatar img {
          width: 100%;
        }

        .note {
          font-size: 0.9em;
          line-height: 1.6;
        }

        @from-width tablet {
          .author {
            display: flex;
          }

          .avatar {
            flex: 0 0 auto;
          }
        }
      `}</style>
    </React.Fragment>
  );
};

function QueryAuthor(props) {
  // The image could be in ./content or ../content, so use a query
  return (
    <StaticQuery
      query={graphql`
        query AuthorQuery {
          file(base: { eq: "author.jpg" }) {
            publicURL
          }
        }
      `}
      render={data => <Author data={data} {...props} />}
    />
  );
}

Author.propTypes = {
  note: PropTypes.string.isRequired,
  data: PropTypes.shape({
    file: PropTypes.shape({
      publicURL: PropTypes.string.isRequired
    })
  }).isRequired
};

export default QueryAuthor;
