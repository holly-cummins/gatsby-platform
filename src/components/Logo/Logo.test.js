import React from "react";
import { render, screen } from "@testing-library/react";

import Logo from "./Logo";

import theme from "../../theme/theme.yaml";

const defaultLogo = "/logos/generic.png";
const defaultLogoAltText = "generic logo";

describe("Logo", () => {
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
