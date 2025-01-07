import React from "react";
import PropTypes from "prop-types";
import EmbedContainer from "react-oembed-container";
import Separator from "./Separator";
import { useTheme } from "../../layouts/theme";

const EmbeddedResource = props => {
  const { oembeds } = props;
  const theme = useTheme();

  if (oembeds) {
    return (
      <React.Fragment>
        <Separator />
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

};

export default EmbeddedResource;
