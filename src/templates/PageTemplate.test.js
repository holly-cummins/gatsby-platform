import React from "react";
import { render, screen } from "@testing-library/react";

import PageTemplate from "./PageTemplate";

import { ThemeContext } from "../layouts";

import themeObjectFromYaml from "../theme/theme.yaml";

// @see https://testing-library.com/docs/react-testing-library/setup#custom-render
const renderWithTheme = ui => {
  return render(<ThemeContext.Provider value={themeObjectFromYaml}>{ui}</ThemeContext.Provider>);
};

describe("PageTemplate", () => {
  it("renders the title", () => {
    const html = "html";
    const slug = "sluggeroo";
    const title = "some page";
    const page = {
      frontmatter: { category: "test-stuff", title },
      fields: { source: "pages", slug },
      html
    };
    const data = {
      page
    };

    const tree = renderWithTheme(<PageTemplate data={data} />);
    expect(screen.getByText(title)).toBeTruthy();
  });
});
