import React from "react";
import PropTypes from "prop-types";
import { Rss as RssIcon } from "@carbon/icons-react";
import { Link } from "gatsby";
import config from "../../utils/configger";
import { useTheme } from "../../layouts/theme";

// Extend the carbon react icon to add accessibility labels and make it not
// hidden to screenreaders (the carbon default)
class Rss extends React.Component {
  render() {
    return <RssIcon title="rss" aria-label="rss" size={20} />;
  }
}


const Footer = () => {
  const theme = useTheme();

  // At some point we may want to switch to mdx instead of hardcoding footer content (which is needed for the rss icon) but it's a more invasive change
  // noinspection CssInvalidAtRule; postcss-easy-media-query adds new at-rules
  return (
    <React.Fragment>
      <footer className="footer">
        <ul>
          <li>built by {config.authorName.toLowerCase()}</li>
          <li>follow {config.authorShortName.toLowerCase()} on <a
            href={config.authorSocialLinks[0].url}>{config.authorSocialLinks[0].name}</a></li>
          <li>
            <Link href="/rss.xml">
              <Rss />
            </Link>
          </li>
        </ul>
      </footer>

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
  theme: PropTypes.object.isRequired
};

export default Footer;
