import React from "react";
import { render, screen } from "@testing-library/react";
import ContactPage from "./contact";

import { ThemeContext } from "../layouts";
import { cover } from "../../__mocks__/site.js";
import config from "../../content/meta/config";

import themeObjectFromYaml from "../theme/theme.yaml";

// @see https://testing-library.com/docs/react-testing-library/setup#custom-render
const renderWithTheme = (ui, theme) => {
  return render(<ThemeContext.Provider value={theme}>{ui}</ThemeContext.Provider>);
};

const layoutData = {
  bgDesktop: {
    resize: { src: "desktop" }
  },
  bgTablet: {
    resize: { src: "tablet" }
  },
  bgMobile: {
    resize: { src: "mobile" }
  }
};

describe("ContactPage", () => {
  beforeEach(async () => {
    renderWithTheme(<ContactPage />, themeObjectFromYaml);
  });
  it("renders without error and includes some social links", async () => {
    expect(screen.getByText("@" + config.authorTwitterAccount)).toBeTruthy();
  });

  it("includes multiple social links", async () => {
    expect(screen.getAllByRole("link")).toHaveLength(4); // This is a bit coupled to our content, but it's easy enough to maintain
  });
});
