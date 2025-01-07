import React from "react";
import PropTypes from "prop-types";
import EmbedContainer from "react-oembed-container";
import Separator from "./Separator";
import { useTheme } from "../../layouts/theme";

const Video = props => {
  const { video } = props;
  const theme = useTheme();

  if (video && video.html) {
    return (
      <React.Fragment>
        <Separator />

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
            .Video {
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

Video.propTypes = {
  video: PropTypes.object,

};

export default Video;
