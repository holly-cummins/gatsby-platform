import React from "react";
import { render, screen } from "@testing-library/react";
import CategoryPage from "./category";

import { ThemeContext } from "../layouts";
import { cover } from "../../__mocks__/site.js";

import theme from "../theme/theme.yaml";

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
  },
  site: {
    siteMetadata: { facebook: {} }
  }
};

describe("CategoryPage", () => {
  describe("with no posts or publications", () => {
    const data = {
      ...layoutData,
      posts: { edges: [] }
    };
    beforeEach(async () => {
      renderWithTheme(<CategoryPage data={data} />, theme);
    });

    it("renders the title", async () => {
      expect(screen.getByText("Posts by categories")).toBeTruthy();
    });
  });

  describe("with some posts and publications", () => {
    const category = "sock stories";
    const title1 = "the first title";
    const title2 = "the second title";

    const post1 = {
      node: {
        fields: {
          slug: "/slug1/"
        },
        frontmatter: {
          title: title1,
          cover,
          category
        }
      }
    };
    const pub2 = {
      node: {
        fields: {
          url: "http://somewhere.else"
        },
        frontmatter: {
          title: title2,
          cover,
          category
        }
      }
    };
    const data = {
      ...layoutData,
      posts: { edges: [post1, pub2] }
    };

    beforeEach(async () => {
      renderWithTheme(<CategoryPage data={data} />, theme);
    });

    it("renders the category name", async () => {
      expect(screen.getByText(category)).toBeTruthy();
    });
    it("renders a list of posts", async () => {
      expect(screen.getByRole("list")).toBeTruthy();
    });

    // More detailed testing of Item content can be in the Item test, we just want something
    it("renders the first post title", async () => {
      expect(screen.getByText(title1)).toBeTruthy();
    });
    it("renders the second post title", async () => {
      expect(screen.getByText(title2)).toBeTruthy();
    });
  });
});
