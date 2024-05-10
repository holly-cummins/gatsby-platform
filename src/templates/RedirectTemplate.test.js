import React from "react";
import { render } from "@testing-library/react";

import { ThemeContext } from "../layouts";

import theme from "../theme/theme.yaml";
import RedirectTemplate from "./RedirectTemplate";
import Helmet from "react-helmet";

// @see https://testing-library.com/docs/react-testing-library/setup#custom-render
const renderWithTheme = ui => {
  return render(<ThemeContext.Provider value={theme}>{ui}</ThemeContext.Provider>);
};

describe("RedirectTemplate", () => {
  const node = {
    url: "http://nice-place.com"
  };

  beforeEach(() => {
    renderWithTheme(<RedirectTemplate pageContext={{ node }} />);
  });

  it("should render correct meta data for the front page", () => {
    const helmet = Helmet.peek();

    expect(helmet.metaTags).toContainEqual(
      expect.objectContaining({
        "http-equiv": "refresh"
      })
    );
  });
});
