import React from "react";
import { render, screen } from "@testing-library/react";
import IndexPage from "./index";

import { ThemeContext } from "../layouts";
import { cover } from "../../__mocks__/site.js";

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

describe("IndexPage", () => {
  describe("with no posts or publications", () => {
    const data = {
      ...layoutData,
      entries: { edges: [] }
    };
    beforeEach(async () => {
      renderWithTheme(<IndexPage data={data} />, themeObjectFromYaml);
    });

    it("renders the scroll button", async () => {
      expect(screen.getByLabelText("scroll")).toBeTruthy();
    });
  });

  describe("with some posts", () => {
    const title1 = "the first title";
    const title2 = "the second title";

    const post1 = {
      node: {
        fields: {
          slug: "/slug1/"
        },
        frontmatter: {
          title: title1,
          cover
        }
      }
    };
    const post2 = {
      node: {
        fields: {
          slug: "/slug2/"
        },
        frontmatter: {
          title: title2,
          cover
        }
      }
    };
    const data = {
      ...layoutData,
      entries: { edges: [post1, post2] }
    };

    beforeEach(async () => {
      renderWithTheme(<IndexPage data={data} />, themeObjectFromYaml);
    });

    it("renders the scroll button", async () => {
      expect(screen.getByLabelText("scroll")).toBeTruthy();
    });

    it("renders a list of entries", async () => {
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
  describe("with some publications", () => {
    const title1 = "the first publication";
    const title2 = "the second publication";

    const pub1 = {
      node: {
        fields: {
          url: "http://somewhere"
        },
        frontmatter: {
          title: title1,
          cover
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
          cover
        }
      }
    };
    const data = {
      ...layoutData,
      entries: { edges: [pub1, pub2] }
    };

    beforeEach(async () => {
      renderWithTheme(<IndexPage data={data} />, themeObjectFromYaml);
    });

    it("renders a list of entries", async () => {
      expect(screen.getByRole("list")).toBeTruthy();
    });

    // More detailed testing of Item content can be in the Item test, we just want something
    it("renders the first publication title", async () => {
      expect(screen.getByText(title1)).toBeTruthy();
    });
    it("renders the second publication title", async () => {
      expect(screen.getByText(title2)).toBeTruthy();
    });
  });
});
