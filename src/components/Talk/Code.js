import React from "react";
import PropTypes from "prop-types";

import GitHubIcon from "!svg-react-loader!../../images/svg-icons/github.svg";
import Separator from "./Separator";

const Code = props => {
  const { code, theme } = props;

  if (code && code.length > 0) {
    return (
      <React.Fragment>
        <Separator theme={theme} />

        <h2>Code</h2>
        <div>
          {code.map((el, pos) => {
            const title = el.title ? el.title + ": " : "";
            const icon = el.url.includes("github") ? <GitHubIcon /> : <></>;
            return (
              <div key={pos} className="code">
                <div className="icon">{icon}</div>
                <div>
                  {title}
                  <a href={el.url}>{el.url}</a>
                </div>
              </div>
            );
          })}
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

          h2 {
            padding-top: 20px;
            padding-bottom: 20px;
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

          @from-width tablet {
            .Code {
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

Code.propTypes = {
  video: PropTypes.object,
  theme: PropTypes.object.isRequired
};

export default Code;
