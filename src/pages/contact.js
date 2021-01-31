import PropTypes from "prop-types";
import React from "react";
import { graphql } from "gatsby";
import { ThemeContext } from "../layouts";
import Article from "../components/Article";
import Headline from "../components/Article/Headline";
import Seo from "../components/Seo";
import config from "../../content/meta/config";

import LinkedInIcon from "!svg-react-loader!../images/svg-icons/linkedin.svg";
import TwitterIcon from "!svg-react-loader!../images/svg-icons/twitter.svg";
import GitHubIcon from "!svg-react-loader!../images/svg-icons/github.svg";

const icons = { linkedin: <LinkedInIcon />, twitter: <TwitterIcon />, github: <GitHubIcon /> };

const ContactPage = props => {
  const {
    data: {
      site: {
        siteMetadata: { facebook }
      }
    }
  } = props;

  const platforms = config.authorSocialLinks;

  return (
    <React.Fragment>
      <ThemeContext.Consumer>
        {theme => (
          <Article theme={theme}>
            <header>
              <Headline title="Contact" theme={theme} />
            </header>
            <p>You can message me on social media.</p>
            <ul>
              {platforms.map(platform => (
                <li key={platform.name}>
                  <div>
                    <div className="icon">{icons[platform.name]}</div>
                    <a href={platform.url}>{platform.display}</a>
                  </div>
                </li>
              ))}
            </ul>
            {/* --- STYLES --- */}
            <style jsx>
              {`
                ul {
                  margin: ${theme.space.stack.m};
                  padding: ${theme.space.m};
                  list-style: none;
                }
                li {
                  padding: ${theme.space.xs} 0;
                  font-size: ${theme.font.size.m};
                  line-height: ${theme.font.lineHeight.l};
                }
                div {
                  display: flex;
                  justify-content: flex-begin;
                  align-items: center;
                }
                .icon {
                  padding: ${theme.space.m};
                }
                .icon :global(svg) {
                  height: 40px;
                }
              `}
            </style>
          </Article>
        )}
      </ThemeContext.Consumer>

      <Seo facebook={facebook} />
    </React.Fragment>
  );
};

ContactPage.propTypes = {
  data: PropTypes.object.isRequired
};

export default ContactPage;

//eslint-disable-next-line no-undef
export const query = graphql`
  query ContactQuery {
    site {
      siteMetadata {
        facebook {
          appId
        }
      }
    }
  }
`;
