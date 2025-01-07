import React from "react";
import { render, screen } from "@testing-library/react";
import CategoryPage from "./category";

import { cover } from "../../__mocks__/site.js";

import config from "../utils/configger";
import { setToProd, restoreOldEnvironment } from "../utils/filters.test";

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

describe("CategoryPage", () => {
  describe("with no posts or publications", () => {
    const data = {
      ...layoutData,
      posts: { edges: [] }
    };
    beforeEach(async () => {
      render(<CategoryPage data={data} />);
    });

    it("renders the title", async () => {
      expect(screen.getByText(`What's ${config.authorShortName} Thinking About?`)).toBeTruthy();
    });
  });

  describe("with some posts and publications", () => {
    const category = "sock-stories";
    const displayCategory = "SOck sTOry with a deliberate DIFFERENCE";
    const title1 = "the first title";
    const draftTitle = "the second title";

    const post1 = {
      node: {
        fields: {
          slug: "/slug1/",
          prefix: "2020-10-10",
          title: title1,
          cover,
          category
        },
        frontmatter: {}
      }
    };
    const draftPub = {
      node: {
        fields: {
          slug: "pub2",
          url: "http://somewhere.else",
          prefix: "draft",
          draft: true,
          title: draftTitle,
          cover,
          category,
          displayCategory
        },
        frontmatter: {}
      }
    };
    const data = {
      ...layoutData,
      posts: { edges: [post1, draftPub] }
    };

    beforeEach(async () => {
      render(<CategoryPage data={data} />);
    });

    it("renders the category name", async () => {
      expect(screen.getByText(displayCategory)).toBeTruthy();
    });

    it("uses the normalised category for the link", () => {
      const categoryElement = screen.getByText(displayCategory);
      expect(categoryElement.getAttribute("href")).toMatch(new RegExp(".*/" + category + "$"));
    });

    it("renders a list of posts", async () => {
      expect(screen.getByRole("list")).toBeTruthy();
    });

    it("includes a link to just that category", async () => {
      const link = screen.getByRole("link", { name: displayCategory });

      // Note replacement of space with a dash
      expect(link).toHaveAttribute("href", "/category/sock-stories");
    });

    // More detailed testing of Item content can be in the Item test, we just want something
    it("renders the first post title", async () => {
      expect(screen.getByText(title1)).toBeTruthy();
    });

    it("renders the draft post title", async () => {
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

      it("filters out drafts", async () => {
        expect(screen.queryByText(draftTitle)).toBeFalsy();
      });
    });
  });
});
