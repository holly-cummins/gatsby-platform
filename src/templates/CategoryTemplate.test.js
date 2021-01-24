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
  describe("for an internal post", () => {
    const title = "some post";
    const totalCount = 42;
    const slug = "sluggaroo";
    const node = {
      node: {
        frontmatter: { category: "test-stuff", title },
        fields: { source: "some-source", slug }
      }
    };
    const edges = [node];
    const facebook = { appId: "remove-soon" };
    const data = {
      allMarkdownRemark: { totalCount, edges },
      site: {
        siteMetadata: { facebook }
      }
    };
    beforeEach(() => {
      const tree = renderWithTheme(<CategoryTemplate data={data} pageContext={{}} />);
    });

    it("renders the title", () => {
      expect(screen.getByText(totalCount)).toBeTruthy();
    });

    it("renders the correct link", () => {
      const link = screen.getByRole("link");
      expect(link).toBeTruthy();
      // Hardcoding the host is a bit risky but this should always be true in  test environment
      expect(link.href).toBe("http://localhost/" + slug);
    });
  });
});
