import React from "react";
import { render, screen } from "@testing-library/react";

import CategoryTemplate from "./CategoryTemplate";

import { setToProd, restoreOldEnvironment } from "../utils/filters.test";


describe("CategoryTemplate", () => {
  describe("for an internal post", () => {
    const title = "some post";
    const draftTitle = "a partial post";

    const slug = "sluggaroo";
    const node = {
      node: {
        frontmatter: {},
        fields: { category: "test-stuff", title, source: "some-source", slug, prefix: "2021-12-17" }
      }
    };

    const draftNode = {
      node: {
        frontmatter: {},
        fields: {
          category: "bake-off",
          title: draftTitle,
          source: "another-source",
          slug: "half-baked-slug",
          prefix: "draft",
          draft: "true"
        }
      }
    };
    const edges = [draftNode, node];
    const data = {
      allMarkdownRemark: { edges }
    };

    beforeEach(() => {
      render(<CategoryTemplate data={data} pageContext={{}} />);
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
