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
  const title = "some post";
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
  describe("for a collection of podcasts", () => {
    const type = "podcast";

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

    it("renders a list", () => {
      // Coupling to the internals of List, but we need some way to make sure the right one is included
      expect(screen.getByTestId("post-list-wrapper")).toBeTruthy();
    });
  });

  describe("for a collection of external media", () => {
    const type = "media";

    beforeEach(() => {
      const tree = renderWithTheme(<TypeTemplate data={data} pageContext={{ type }} />);
    });

    it("renders a list with icons", () => {
      // Coupling to the internals of List, but we need some way to make sure the right one is included
      expect(screen.getByTestId("logo-list-wrapper")).toBeTruthy();
    });
  });
});
