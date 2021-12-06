import React from "react";
import PropTypes from "prop-types";
// At some point we may want to switch to mdx instead of rehype but it's a much more invasive change
import rehypeReact from "rehype-react";
import { Rss16 } from "@carbon/icons-react";

// Extend the carbon react icon to add accessibility labels and make it not
// hidden to screenreaders (the carbon default)
class Rss extends React.Component {
  render() {
    return <Rss16 title="rss" aria-label="rss" />;
  }
}

const Footer = props => {
  const { htmlAst, theme } = props;

  const renderAst = new rehypeReact({
    createElement: React.createElement,
    components: { rss: Rss }
  }).Compiler;

  return (
    <React.Fragment>
      <footer className="footer">{renderAst(htmlAst)}</footer>

      {/* --- STYLES --- */}
      <style jsx>{`
        .footer {
          background: ${theme.color.neutral.white};
          padding: ${theme.space.inset.default};
          padding-top: 0;
          padding-bottom: 120px;

          :global(ul) {
            list-style: none;
            text-align: center;
            padding: 0;

            :global(li) {
              color: ${theme.color.neutral.gray.g};
              font-size: ${theme.font.size.xxs};
              padding: ${theme.space.xxs} ${theme.space.s};
              position: relative;
              display: inline-block;

              &::after {
                content: "•";
                position: absolute;
                right: ${`calc(${theme.space.xs} * -1)`};
              }
              &:last-child::after {
                content: "";
              }
            }
          }
        }

        @from-width desktop {
          .footer {
            padding: 0 1em 1.5em;
          }
        }
      `}</style>
    </React.Fragment>
  );
};

Footer.propTypes = {
  htmlAst: PropTypes.object,
  theme: PropTypes.object.isRequired
};

export default Footer;
