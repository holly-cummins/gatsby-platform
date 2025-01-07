import React from "react";
import { useTheme } from "../../layouts/theme";

const Separator = () => {
  const theme = useTheme();

  return (
    <React.Fragment>
      <div className="separator" />

      <style jsx>{`
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
      `}</style>
    </React.Fragment>
  );
};

Separator.propTypes = {};

export default Separator;
