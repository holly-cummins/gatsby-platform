import React from "react";
import PropTypes from "prop-types";
import EmbedContainer from "react-oembed-container";

const Meta = props => {
  const { slides, theme } = props;

  if (slides && slides.html) {
    return (
      <React.Fragment>
        <div className="separator"></div>
        <EmbedContainer markup={slides.html}>
          <a href={slides.url}>
            <h2>{slides.title}</h2>
          </a>
          <div className="slides" dangerouslySetInnerHTML={{ __html: slides.html }} />
          <a href={slides.url}>
            <div className="sourcelink">[source]</div>
          </a>
        </EmbedContainer>

        {/* --- STYLES --- */}
        <style jsx>{`
          :global(iframe) {
            border-radius: ${theme.size.radius.default};
            width: 100%;
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

          .slides {
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

Meta.propTypes = {
  slides: PropTypes.object,
  theme: PropTypes.object.isRequired
};

export default Meta;
