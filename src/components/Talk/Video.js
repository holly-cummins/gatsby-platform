import React from "react";
import PropTypes from "prop-types";
import EmbedContainer from "react-oembed-container";

const Meta = props => {
  const { video, theme } = props;

  if (video && video.html) {
    return (
      <React.Fragment>
        <div className="separator"></div>
        <EmbedContainer markup={video.html}>
          <a href={video.url}>
            <h2>{video.title}</h2>
          </a>
          <div className="video" dangerouslySetInnerHTML={{ __html: video.html }} />
        </EmbedContainer>

        {/* --- STYLES --- */}
        <style jsx>{`
          :global(iframe) {
            border-radius: ${theme.size.radius.default};
          }

          .separator {
            border-top: 1px solid ${theme.line.color};
            content: "";
            transition: all ${theme.time.duration.default};
            width: 50%;
            margin-left: auto;
            margin-right: auto;
            margin-bottom: ${theme.space.default};
            margin-top: ${theme.space.default};
          }

          .video {
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
      </React.Fragment>
    );
  } else {
    return <></>;
  }
};

Meta.propTypes = {
  video: PropTypes.object,
  theme: PropTypes.object.isRequired
};

export default Meta;
