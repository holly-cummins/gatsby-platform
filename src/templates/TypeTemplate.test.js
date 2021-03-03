import React from "react";
import { render, screen } from "@testing-library/react";

import TypeTemplate from "./TypeTemplate";

import { ThemeContext } from "../layouts";

import theme from "../theme/theme.yaml";

// @see https://testing-library.com/docs/react-testing-library/setup#custom-render
const renderWithTheme = ui => {
  return render(<ThemeContext.Provider value={theme}>{ui}</ThemeContext.Provider>);
};

describe("TypeTemplate", () => {
  describe("for an internal post", () => {
    const title = "some post";
    const type = "podcast";
    const totalCount = 42;
    const slug = "sluggaroo";
    const node = {
      node: {
        frontmatter: { type: "dance-off", title },
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
      const tree = renderWithTheme(<TypeTemplate data={data} pageContext={{ type }} />);
    });

    it("renders the title", () => {
      expect(screen.getByText(title)).toBeTruthy();
    });

    it("renders the icon", () => {
      // We could try and dig into the HMTL to find the exact image source, but let's trust the icon sets the right alt text
      const testId = type + "-icon";
      expect(screen.getByTestId(testId)).toBeTruthy();
    });

    it("renders the correct link", () => {
      const link = screen.getByRole("link");
      expect(link).toBeTruthy();
      // Hardcoding the host is a bit risky but this should always be true in  test environment
      expect(link.href).toBe("http://localhost/" + slug);
    });
  });
});
