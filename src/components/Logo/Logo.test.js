import React from "react";
import { render, screen } from "@testing-library/react";

import Logo from "./Logo";

import theme from "../../theme/theme.yaml";

const defaultLogo = "/logos/generic.png";
const defaultLogoAltText = "generic logo";

describe("Logo", () => {
  describe("for a known source", () => {
    const url = "http://forbes.com/site/something";

    beforeEach(() => {
      render(<Logo site={url} theme={theme} />);
    });

    it("renders the appropriate logo", () => {
      const image = screen.getByAltText("forbes logo");
      expect(image).toBeTruthy();
      expect(image.getAttribute("src")).toEqual("/logos/forbes.png");
    });
  });

  describe("for a known source with a .io extension", () => {
    const url = "https://thenewstack.io/want-to-save-the-world-start-by-cutting-your-cloud-costs/";

    beforeEach(() => {
      render(<Logo site={url} theme={theme} />);
    });

    it("renders the appropriate logo", () => {
      const image = screen.getByAltText("thenewstack logo");
      expect(image).toBeTruthy();
      expect(image.getAttribute("src")).toEqual("/logos/thenewstack.png");
    });
  });

  describe("for an unknown source", () => {
    const url = "http://elsewhere.com";

    beforeEach(() => {
      render(<Logo site={url} theme={theme} />);
    });

    it("renders the default image", () => {
      const image = screen.getByAltText(defaultLogoAltText);
      expect(image).toBeTruthy();
      expect(image.getAttribute("src")).toEqual(defaultLogo);
    });
  });

  describe("when the url is undefined", () => {
    beforeEach(() => {
      render(<Logo theme={theme} />);
    });

    it("renders the default image", () => {
      const image = screen.getByAltText(defaultLogoAltText);
      expect(image).toBeTruthy();
      expect(image.getAttribute("src")).toEqual(defaultLogo);
    });
  });
});
