import React from "react";
import PropTypes from "prop-types";
import { useTheme } from "../../layouts/theme";

const Headline = props => {
  const { title, children } = props;
  const theme = useTheme();

  return (
    <React.Fragment>
      {title ? <h1>{title}</h1> : <h1>{children}</h1>}

      {/* --- STYLES --- */}
      <style jsx>{`
        h1 {
          font-size: ${theme.font.size.xxl};
          margin: ${theme.space.stack.l};
          animation-name: headlineEntry;
          animation-duration: ${theme.time.duration.long};
          display: flex;
          align-items: center; /* align vertical */

          :global(span) {
            font-weight: ${theme.font.weight.standard};
            display: block;
            font-size: 0.5em;
            letter-spacing: 0;
            margin: ${theme.space.stack.xs};
          }

          :global(svg) {
            height: ${theme.font.size.s};
            width: ${theme.font.size.s};
            fill: ${theme.color.brand.primary};
            margin: ${theme.space.m};
          }
        }

        @keyframes headlineEntry {
          from {
            opacity: 0.5;
          }
          to {
            opacity: 1;
          }
        }

        @from-width tablet {
          h1 {
            font-size: ${`calc(${theme.font.size.xl} * 1.2)`};
          }
        }

        @from-width desktop {
          h1 {
            font-size: ${`calc(${theme.font.size.xl} * 1.4)`};
          }
        }
      `}</style>
    </React.Fragment>
  );
};

Headline.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node,

};

export default Headline;
