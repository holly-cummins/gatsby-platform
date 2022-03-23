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
          <h2>{slides.title}</h2>
          <div className="slides" dangerouslySetInnerHTML={{ __html: slides.html }} />
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
          }
          .slides {
            margin: ${theme.space.m} 0;
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
