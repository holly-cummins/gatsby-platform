import React from "react";
import PropTypes from "prop-types";

import GitHubIcon from "!svg-react-loader!../../images/svg-icons/github.svg";

const Meta = props => {
  const { code, theme } = props;

  if (code && code.url) {
    const title = code.title ? code.title + ": " : "";
    const icon = code.url.includes("github") ? <GitHubIcon /> : <></>;

    return (
      <React.Fragment>
        <div className="separator"></div>
        <h2>Code</h2>
        <div className="code">
          <div className="icon">{icon}</div>
          <div>
            {title}
            <a href={code.url}>{code.url}</a>
          </div>
        </div>
        {/* --- STYLES --- */}
        <style jsx>{`
          :global(iframe) {
            border-radius: ${theme.size.radius.default};
          }

          :global(svg) {
            fill: ${theme.icon.color};
            margin: ${theme.space.inline.xs};
          }

          .code {
            display: flex;
            flex-direction: row;
            align-items: center;
            margin: ${theme.space.xs} ${theme.space.s} ${theme.space.xs} 0;
          }

          .icon {
          }

          .icon :global(svg) {
            height: 40px;
          }

          .separator {
            border-top: 1px solid ${theme.line.color};
            content: "";
            transition: all ${theme.time.duration.default};
            width: 50%;
            margin-left: auto;
            margin-right: auto;
            margin-bottom: ${theme.space.default};
            margin-top: ${theme.space.default};
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
  video: PropTypes.object,
  theme: PropTypes.object.isRequired
};

export default Meta;
