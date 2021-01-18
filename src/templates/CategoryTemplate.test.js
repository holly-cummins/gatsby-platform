import React from "react";
import { render, screen } from "@testing-library/react";

import CategoryTemplate from "./CategoryTemplate";

import { ThemeContext } from "../layouts";

import themeObjectFromYaml from "../theme/theme.yaml";

// @see https://testing-library.com/docs/react-testing-library/setup#custom-render
const renderWithTheme = ui => {
  return render(<ThemeContext.Provider value={themeObjectFromYaml}>{ui}</ThemeContext.Provider>);
};

describe("CategoryTemplate", () => {
  it("renders the title", () => {
    const title = "some post";
    const totalCount = 42;
    const node = {
      node: { frontmatter: { category: "test-stuff" }, fields: { source: "some-source" } }
    };
    const edges = [node];
    const facebook = { appId: "remove-soon" };
    const data = {
      allMarkdownRemark: { totalCount, edges },
      site: {
        siteMetadata: { facebook }
      }
    };

    const tree = renderWithTheme(<CategoryTemplate data={data} pageContext={{}} />);
    expect(screen.getByText(totalCount)).toBeTruthy();
  });
});
