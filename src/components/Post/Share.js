import React from "react";
import PropTypes from "prop-types";
import {
  LinkedinShareButton,
  BlueskyShareButton,
  BlueskyIcon,
  LinkedinIcon
} from "react-share";

import config from "../../utils/configger";
import { useTheme } from "../../layouts/theme";

const PostShare = props => {
  const {
    post: {
      fields: { slug },
      frontmatter: { title },
      excerpt
    }
  } = props;
  const theme = useTheme();

  const url = config.siteUrl + config.pathPrefix + slug;

  const iconSize = 36;

  return (
    <React.Fragment>
      <div className="share">
        <span className="label">SHARE</span>
        <div className="links">
          <BlueskyShareButton
            url={url}
            title={title}
          >
            <BlueskyIcon round size={iconSize} />
          </BlueskyShareButton>
          <LinkedinShareButton
            url={url}
            title={title}
            description={excerpt}
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
  post: PropTypes.object.isRequired

};

export default PostShare;
