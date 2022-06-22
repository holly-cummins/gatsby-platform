import React from "react";
import PropTypes from "prop-types";
import EmbedContainer from "react-oembed-container";

const EmbeddedResource = props => {
  const { oembeds, theme } = props;

  if (oembeds) {
    return (
      <React.Fragment>
        <div className="separator"></div>
        <h2>Other resources</h2>
        {oembeds.map((embed, i) => {
          if (embed.html) {
            return (
              <EmbedContainer markup={embed.html} key={i}>
                <a href={embed.url}>
                  <h3>{embed.title}</h3>
                </a>
                <div className="embed" dangerouslySetInnerHTML={{ __html: embed.html }} />
                <a href={embed.url}>
                  <div className="sourcelink">[source]</div>
                </a>
              </EmbedContainer>
            );
          }
        })}

        {/* --- STYLES --- */}
        <style jsx>{`
          :global(iframe) {
            border-radius: ${theme.size.radius.default};
            width: 100%;
          }

          h2 {
            padding-top: 20px;
            padding-bottom: 20px;
          }

          .separator {
            border-top: 1px solid ${theme.line.color};
            content: "";
            transition: all ${theme.time.duration.default};
            width: 50%;
            margin-left: auto;
            margin-right: auto;
            margin-bottom: ${theme.space.default};
          }

          .embed {
            margin: ${theme.space.m} 0;
          }

          .sourcelink {
            font-size: ${theme.font.size.xxs};
            text-align: center;
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

EmbeddedResource.propTypes = {
  oembeds: PropTypes.array,
  theme: PropTypes.object.isRequired
};

export default EmbeddedResource;
