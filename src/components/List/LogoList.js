import React from "react";
import PropTypes from "prop-types";
import { Link } from "gatsby";
import Logo from "../Logo/Logo.js";

const LogoList = props => {
  const { edges, theme } = props;

  return (
    <React.Fragment>
      <ul data-testid="logo-list-wrapper">
        {edges.map(edge => {
          const {
            node: {
              frontmatter: { url },
              fields: { title, slug }
            }
          } = edge;

          const divs = (
            <div className="row">
              <Logo site={url} theme={theme} />
              <div>{title}</div>
            </div>
          );

          return (
            <li key={slug} className="logo-list">
              <Link to={slug}>{divs}</Link>
            </li>
          );
        })}
      </ul>

      {/* --- STYLES --- */}
      <style jsx>{`
        ul {
          margin: ${theme.space.stack.m};
          padding: ${theme.space.m};
          list-style: none;
        }

        li {
          font-size: ${theme.font.size.s};
          line-height: ${theme.font.lineHeight.l};
        }

        .row {
          display: flex;
          align-items: center;
        }
      `}</style>
    </React.Fragment>
  );
};

LogoList.propTypes = {
  edges: PropTypes.array.isRequired,
  theme: PropTypes.object.isRequired
};

export default LogoList;
