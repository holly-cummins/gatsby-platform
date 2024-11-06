import React from "react";
import PropTypes from "prop-types";
import { useTheme } from "../../layouts/theme";

const Article = props => {
  const { children } = props;
  const theme = useTheme();

  return (
    <React.Fragment>
      <article className="article">{children}</article>

      {/* --- STYLES --- */}
      <style jsx>{`
        .article {
          padding: ${theme.space.inset.default};
          margin: 0 auto;
        }

        @from-width tablet {
          .article {
            padding: ${`calc(${theme.space.default}) calc(${theme.space.default} * 2)`};
            max-width: ${theme.text.maxWidth.tablet};
          }
        }
        @from-width desktop {
          .article {
            padding: ${`calc(${theme.space.default} * 2 + 90px) 0 calc(${
              theme.space.default
            } * 2)`};
            max-width: ${theme.text.maxWidth.desktop};
          }
        }
      `}</style>
    </React.Fragment>
  );
};

Article.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Article;
