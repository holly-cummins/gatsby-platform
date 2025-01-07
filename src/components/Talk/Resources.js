import React from "react";
import PropTypes from "prop-types";

import Separator from "./Separator";
import { icon } from "../../utils/type";
import { useTheme } from "../../layouts/theme";

const Resources = props => {
  const { resources } = props;

  const theme = useTheme();

  if (resources && resources.length > 0) {
    return (
      <React.Fragment>
        <Separator />

        <h2>Resources</h2>
        <ul>
          {resources.map((el, pos) => {
            const isBook = el.type === "book";
            const title = el.title ? el.title : "";
            const Icon = el.type ? icon(el.type) : icon("blog");
            return (
              <li key={pos} className="resources">
                <Icon />
                <div>
                  {(isBook && (
                    <i>
                      <a href={el.url}>{title}</a>
                    </i>
                  )) || <a href={el.url}>{title}</a>}
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

};

export default Resources;
