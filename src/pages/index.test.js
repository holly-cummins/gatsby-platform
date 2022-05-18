import React from "react";
import { render, screen } from "@testing-library/react";
import IndexPage from "./index";

import { ThemeContext } from "../layouts";
import { cover } from "../../__mocks__/site.js";

import themeObjectFromYaml from "../theme/theme.yaml";
import { setToProd, restoreOldEnvironment } from "../utils/filters.test";

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
    const draftTitle = "the title of an incomplete article";

    const post1 = {
      node: {
        fields: {
          slug: "/slug1/",
          prefix: "2021-12-17",
          cover,
          title: title1
        },
        frontmatter: {
          title: "wrong one"
        }
      }
    };
    const post2 = {
      node: {
        fields: {
          slug: "/slug2/",
          prefix: "2022-04-07",
          title: title2,
          cover
        },
        frontmatter: {
          title: "still the wrong one"
        }
      }
    };

    const draft = {
      node: {
        fields: {
          slug: "/slug3/",
          prefix: "draft",
          title: draftTitle,
          cover
        },
        frontmatter: {
          title: "not this one either"
        }
      }
    };
    const data = {
      ...layoutData,
      entries: { edges: [post1, post2, draft] }
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

    it("includes all drafts", async () => {
      expect(screen.getByText(draftTitle)).toBeTruthy();
    });

    describe("in production", () => {
      beforeAll(() => {
        setToProd();
      });

      afterAll(() => {
        restoreOldEnvironment();
      });

      it("renders the first post title", async () => {
        expect(screen.getByText(title1)).toBeTruthy();
      });

      it("renders the second post title", async () => {
        expect(screen.getByText(title2)).toBeTruthy();
      });

      it("filters out drafts", async () => {
        expect(screen.queryByText(draftTitle)).toBeFalsy();
      });
    });
  });
  describe("with some publications", () => {
    const title1 = "the first publication";
    const title2 = "the second publication";

    const pub1 = {
      node: {
        fields: {
          slug: "slug1",
          url: "http://somewhere",
          title: title1,
          cover
        },
        frontmatter: {}
      }
    };
    const pub2 = {
      node: {
        fields: {
          slug: "slug2",
          url: "http://somewhere.else",
          title: title2,
          cover
        },
        frontmatter: {}
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
