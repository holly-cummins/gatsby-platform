import React from "react";
import PropTypes from "prop-types";

import GitHubIcon from "!svg-react-loader!../../images/svg-icons/github.svg";
import Separator from "./Separator";
import { icon } from "../../utils/type";

const Resources = props => {
  const { resources, theme } = props;

  if (resources && resources.length > 0) {
    return (
      <React.Fragment>
        <Separator theme={theme} />

        <h2>Resources</h2>
        <ul>
          {resources.map((el, pos) => {
            const title = el.title ? el.title : "";
            const Icon = el.type ? icon(el.type) : icon("blog");
            return (
              <li key={pos} className="resources">
                <Icon />
                <div>
                  <a href={el.url}>{title}</a>
                </div>
              </li>
            );
          })}
        </ul>
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

          .resources {
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
            .Resources {
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

Resources.propTypes = {
  video: PropTypes.object,
  theme: PropTypes.object.isRequired
};

export default Resources;
