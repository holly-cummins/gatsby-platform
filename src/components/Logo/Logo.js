import React, { useState } from "react";

// I could tell you how this regex worked, but then I'd have to kill you.
// Only the strong survive, when using regexes.
const sourceFinder = /https?:\/\/(?:.*\.)?([^\.]*)(.com|.io)\/.*/;

function useFallbackImg(img, text, fallback, fallbackalt) {
  const [src, setImg] = useState(img);
  const [alt, setImgAlt] = useState(text);

  function onError(e) {
    console.debug("Missing img", img, e);
    // React bails out of hook renders if the state
    // is the same as the previous state, otherwise
    // fallback erroring out would cause an infinite loop
    setImg(fallback);
    setImgAlt(fallbackalt);
  }

  return { src, alt, onError };
}

/**
 * Usage <Image src='someUrl' fallback='fallbackUrl' alt='something' />
 */
function Image({ src, alt, fallback, theme, ...rest }) {
  const imgProps = useFallbackImg(src, alt, fallback, "generic logo");
  // We perhaps should use gatsby-image here? Dynamism would be different

  return (
    <React.Fragment>
      <img {...imgProps} {...rest} />
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
}

const Logo = props => {
  const { site, theme } = props;
  const source = sourceFinder.test(site) ? site.match(sourceFinder)[1] : "generic";

  return (
    <Image
      src={"/logos/" + source + ".png"}
      fallback="/logos/generic.png"
      alt={source + " logo"}
      theme={theme}
    />
  );
};

export default Logo;
