import React from "react";
import PropTypes from "prop-types";
import {
  LinkedinShareButton,
  TwitterShareButton,
  LinkedinShareCount,
  TwitterIcon,
  LinkedinIcon
} from "react-share";

import config from "../../utils/configger";

const PostShare = props => {
  const {
    post: {
      fields: { slug },
      frontmatter: { title },
      excerpt
    },
    theme
  } = props;

  const url = config.siteUrl + config.pathPrefix + slug;

  const iconSize = 36;
  const filter = count => (count > 0 ? count : "");

  return (
    <React.Fragment>
      <div className="share">
        <span className="label">SHARE</span>
        <div className="links">
          <TwitterShareButton
            url={url}
            title={title}
            additionalProps={{
              "aria-label": "Twitter share"
            }}
          >
            <TwitterIcon round size={iconSize} />
          </TwitterShareButton>
          <LinkedinShareButton
            url={url}
            title={title}
            description={excerpt}
            additionalProps={{
              "aria-label": "LinkedIn share"
            }}
          >
            <LinkedinIcon round size={iconSize} />
          </LinkedinShareButton>
        </div>
      </div>

      {/* --- STYLES --- */}
      <style jsx>{`
        .share {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        .links {
          display: flex;
          flex-direction: row;

          :global(.SocialMediaShareButton) {
            margin: 0 0.8em;
            cursor: pointer;
          }
        }

        .label {
          font-size: 1.2em;
          margin: 0 1em 1em;
        }

        @from-width tablet {
          .share {
            flex-direction: row;
            margin: ${theme.space.inset.l};
          }

          .label {
            margin: ${theme.space.inline.m};
          }
        }
      `}</style>
    </React.Fragment>
  );
};

PostShare.propTypes = {
  post: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

export default PostShare;
