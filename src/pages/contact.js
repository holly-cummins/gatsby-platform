import React from "react";
import Article from "../components/Article";
import Headline from "../components/Article/Headline";
import Seo from "../components/Seo";
import config from "../utils/configger";

import LinkedInIcon from "!svg-react-loader!../images/svg-icons/linkedin.svg";
import MastodonIcon from "!svg-react-loader!../images/svg-icons/mastodon.svg";
import BlueSkyIcon from "!svg-react-loader!../images/svg-icons/bluesky.svg";
import TwitterIcon from "!svg-react-loader!../images/svg-icons/twitter.svg";
import GitHubIcon from "!svg-react-loader!../images/svg-icons/github.svg";
import MediumIcon from "!svg-react-loader!../images/svg-icons/medium.svg";
import { useTheme } from "../layouts/theme";

// This is a slightly old logo, but has the advantage of being recognisable (for now) and SVG

const icons = {
  linkedin: <LinkedInIcon />,
  mastodon: <MastodonIcon />,
  bluesky: <BlueSkyIcon />,
  twitter: <TwitterIcon />,
  github: <GitHubIcon />,
  medium: <MediumIcon />
};

const ContactPage = () => {
  const platforms = config.authorSocialLinks;
  const theme = useTheme();


  return (
    <React.Fragment>
      <Article>
        <header>
          <Headline title="Contact" />
        </header>
        <p>You can find me on several social platforms. Please feel free to reach out.</p>
        <ul>
          {platforms.map(platform => (
            <li key={platform.name} className="social-coordinate">
              <div>
                <div className="icon">{icons[platform.name]}</div>
                <a rel="me" href={platform.url}>
                  {platform.display}
                </a>
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
              justify-content: flex-start;
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
      <Seo />
    </React.Fragment>
  );
};

export default ContactPage;
