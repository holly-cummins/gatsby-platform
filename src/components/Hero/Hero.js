import React from "react";
import PropTypes from "prop-types";

import { FaArrowDown } from "react-icons/fa";
import config from "../../utils/configger";
import { StaticImage } from "gatsby-plugin-image";
import { useTheme } from "../../layouts/theme";

const Hero = props => {
  const { scrollToContent, isContentOutsideMainSourceStructure } = props;
  const theme = useTheme();

  // We can't use a property for the source of the static image, but we can dynamically choose what code gets invoked

  const heroImage = isContentOutsideMainSourceStructure ? (
    <StaticImage
      className="heroImage"
      src="../../../../content/images/jpg/hero-background.jpg"
      loading="eager"
      objectFit="contain"
      // should work, does not layout="fullWidth"
      alt="a hero image"
    />
  ) : (
    <StaticImage
      src="../../../content/images/jpg/hero-background.jpg"
      loading="eager"
      objectFit="contain"
      // should work, does not layout="fullWidth"
      alt="a hero image"
      imgClassName="heroImage"
    />
  );

  return (
    <React.Fragment>
      <section className="hero">
        {heroImage}
        <div className="heroOverlay">
          <div className="heroBio">
            <h1>{config.siteTitle}</h1>
            <h2>{config.siteDescription}</h2>
          </div>
          <div>
            <button onClick={scrollToContent} aria-label="scroll">
              <FaArrowDown />
            </button>
          </div>
        </div>
      </section>

      {/* --- STYLES --- */}
      <style jsx>{`
        .hero {
          align-items: center;
          position: relative;
          color: ${theme.text.color.primary.inverse};
          display: flex;
          justify-content: flex-start;
          flex-direction: row;
          flex-wrap: nowrap;
          min-height: 100vh;
          height: 100px;
          padding: ${theme.space.inset.l};
          padding-top: ${theme.header.height.homepage};
        }

        .heroOverlay {
          position: absolute;
        }

        .heroImage {
          overflow: hidden;
        }

        .heroBio {
          max-width: 30%;
        }

        h1 {
          text-align: left;
          font-size: ${theme.hero.h1.size};
          margin: ${theme.space.stack.l};
          color: ${theme.hero.h1.color};
          line-height: ${theme.hero.h1.lineHeight};

          :global(strong) {
            position: relative;

            &::after,
            &::before {
              content: "›";
              color: ${theme.text.color.attention};
              margin: 0 ${theme.space.xs} 0 0;
              text-shadow: 0 0 ${theme.space.s} ${theme.color.neutral.gray.k};
            }

            &::after {
              content: "‹";
              margin: 0 0 0 ${theme.space.xs};
            }
          }
        }

        h2 {
          text-align: left;
          font-size: ${theme.hero.h1.size};
          margin: ${theme.space.stack.l};
          color: ${theme.hero.h1.color};
          line-height: ${theme.hero.h1.lineHeight};

          :global(strong) {
            position: relative;

            &::after,
            &::before {
              content: "›";
              color: ${theme.text.color.attention};
              margin: 0 ${theme.space.xs} 0 0;
              text-shadow: 0 0 ${theme.space.s} ${theme.color.neutral.gray.k};
            }

            &::after {
              content: "‹";
              margin: 0 0 0 ${theme.space.xs};
            }
          }
        }

        button {
          background: ${theme.background.color.brand};
          border: 0;
          border-radius: 50%;
          font-size: ${theme.font.size.m};
          padding: ${theme.space.s} ${theme.space.m};
          cursor: pointer;
          width: ${theme.space.xl};
          height: ${theme.space.xl};

          &:focus {
            outline-style: none;
            background: ${theme.color.brand.primary.active};
          }

          :global(svg) {
            position: relative;
            top: 5px;
            fill: ${theme.color.neutral.white};
            stroke-width: 40;
            stroke: ${theme.color.neutral.white};
            animation-duration: ${theme.time.duration.long};
            animation-name: buttonIconMove;
            animation-iteration-count: infinite;
          }
        }

        @keyframes buttonIconMove {
          0% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
          100% {
            transform: translateY(0);
          }
        }

        /* tablet */
        @media (min-width: 768px) and (max-width: 1024px) {
          h1 {
            max-width: 90%;
            font-size: ${`calc(${theme.hero.h1.size} * 1.3)`};
          }

          button {
            font-size: ${theme.font.size.l};
          }
        }

        /* desktop */
        @media (min-width: 1281px) {
          h1 {
            max-width: 80%;
            font-size: ${`calc(${theme.hero.h1.size} * 1.5)`};
          }

          button {
            font-size: ${theme.font.size.xl};
          }
        }
      `}</style>
    </React.Fragment>
  );
};

Hero.propTypes = {
  scrollToContent: PropTypes.func.isRequired

};

export default Hero;
