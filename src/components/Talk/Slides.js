import React from "react";
import PropTypes from "prop-types";
import EmbedContainer from "react-oembed-container";

const Meta = props => {
  const { slides, theme } = props;

  if (slides && slides.html) {
    return (
      <React.Fragment>
        <EmbedContainer markup={slides.html}>
          <h2>{slides.title}</h2>
          <div className="slides" dangerouslySetInnerHTML={{ __html: slides.html }} />
        </EmbedContainer>

        {/* --- STYLES --- */}
        <style jsx>{`
          :global(iframe) {
            border-radius: ${theme.size.radius.default};
          }

          .slides {
            display: flex;
            flex-flow: row wrap;
            font-size: 0.8em;
            margin: ${theme.space.m} 0;
            background: transparent;

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
  slides: PropTypes.object,
  theme: PropTypes.object.isRequired
};

export default Meta;
