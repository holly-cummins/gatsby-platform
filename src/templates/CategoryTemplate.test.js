import React from "react";
import { render, screen } from "@testing-library/react";

import CategoryTemplate from "./CategoryTemplate";

import { ThemeContext } from "../layouts";

import theme from "../theme/theme.yaml";
import { setToProd, restoreOldEnvironment } from "../utils/filters.test";

// @see https://testing-library.com/docs/react-testing-library/setup#custom-render
const renderWithTheme = ui => {
  return render(<ThemeContext.Provider value={theme}>{ui}</ThemeContext.Provider>);
};

describe("CategoryTemplate", () => {
  describe("for an internal post", () => {
    const title = "some post";
    const draftTitle = "a partial post";

    const slug = "sluggaroo";
    const node = {
      node: {
        frontmatter: { category: "test-stuff" },
        fields: { title, source: "some-source", slug, prefix: "2021-12-17" }
      }
    };

    const draftNode = {
      node: {
        frontmatter: { category: "bake-off" },
        fields: {
          title: draftTitle,
          source: "another-source",
          slug: "half-baked-slug",
          prefix: "draft"
        }
      }
    };
    const edges = [draftNode, node];
    const data = {
      allMarkdownRemark: { edges }
    };

    beforeEach(() => {
      renderWithTheme(<CategoryTemplate data={data} pageContext={{}} />);
    });

    it("renders the total count", () => {
      expect(screen.getByText("2")).toBeTruthy();
    });

    it("uses a plural for the total count", () => {
      expect(screen.getByText("There", { exact: false }).textContent).toEqual(
        "There are 2 posts in the category."
      );
    });

    it("renders the title", () => {
      expect(screen.getByText(title)).toBeTruthy();
    });

    it("renders the draft title", async () => {
      expect(screen.getByText(draftTitle)).toBeTruthy();
    });

    it("renders a list", () => {
      // Coupling to the internals of List, but we need some way to make sure the right one is included
      expect(screen.getByTestId("post-list-wrapper")).toBeTruthy();
    });

    describe("in production", () => {
      beforeAll(() => {
        setToProd();
      });

      afterAll(() => {
        restoreOldEnvironment();
      });

      it("renders the finished post title", async () => {
        expect(screen.getByText(title)).toBeTruthy();
      });

      it("renders the correct link", () => {
        const link = screen.getByRole("link");
        expect(link).toBeTruthy();
        // Hardcoding the host is a bit risky but this should always be true in  test environment
        expect(link.href).toBe("http://localhost/" + slug);
      });

      it("uses a singular for the total count", () => {
        expect(screen.getByText("There", { exact: false }).textContent).toEqual(
          "There is 1 post in the category."
        );
      });

      it("renders an updated total count", () => {
        expect(screen.getByText(1)).toBeTruthy();
      });

      it("filters out drafts", async () => {
        expect(screen.queryByText(draftTitle)).toBeFalsy();
      });
    });
  });
});
