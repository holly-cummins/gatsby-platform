import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import IndexPage from "./index";

import { ThemeContext } from "../layouts";

import themeObjectFromYaml from "../theme/theme.yaml";

// @see https://testing-library.com/docs/react-testing-library/setup#custom-render
const renderWithTheme = (ui, theme) => {
  return render(<ThemeContext.Provider value={theme}>{ui}</ThemeContext.Provider>);
};

describe("IndexPage", () => {
  const data = {
    posts: [],
    bgDesktop: {
      resize: { src: "desktop" }
    },
    bgTablet: {
      resize: { src: "tablet" }
    },
    bgMobile: {
      resize: { src: "mobile" }
    },
    site: {
      siteMetadata: { facebook: {} }
    }
  };
  beforeEach(async () => {
    renderWithTheme(<IndexPage data={data} />, themeObjectFromYaml);
  });

  it("renders the scroll button", async () => {
    expect(screen.getByLabelText("scroll")).toBeTruthy();
  });
});
