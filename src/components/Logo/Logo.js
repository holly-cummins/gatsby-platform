import React from "react";

const Logo = props => {
  const { site, theme } = props;

  return (
    <React.Fragment>
      <img src="/logos/generic.png" alt="generic logo" />

      {/* --- STYLES --- */}
      <style jsx>{`
        img {
          height: ${theme.space.xl};
          width: ${theme.space.xl};
          padding: ${theme.space.s};
          border-radius: 50%;
        }
      `}</style>
    </React.Fragment>
  );
};

export default Logo;
