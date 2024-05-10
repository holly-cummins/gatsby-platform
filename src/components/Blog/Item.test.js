import React from "react";
import { render, screen } from "@testing-library/react";

import Item from "./Item";

import theme from "../../theme/theme.yaml";
import { cover } from "../../../__mocks__/site.js";

describe("Item", () => {
  const title = "Some Test Item";
  const excerpt = "this is a lovely test…";
  const author = "tdd-er";

  describe("for an internal post", () => {
    const slug = "sluggy";

    beforeEach(() => {
      const post = {
        excerpt,
        fields: {
          title,
          cover,
          author,
          slug,
          prefix: "2020-01-06",
          displayCategory: "dull-stuff"
        },
        frontmatter: {
          type: "blog"
        }
      };

      const tree = render(<Item key="some-key" theme={theme} post={post} />);
    });

    it("renders the title", () => {
      expect(screen.getByText(title)).toBeTruthy();
    });

    it("renders the excerpt", () => {
      expect(screen.getByText(excerpt)).toBeTruthy();
    });

    it("renders the author", () => {
      expect(screen.getByText(author)).toBeTruthy();
    });

    it("renders the correct link", () => {
      const link = screen.getByRole("link");
      expect(link).toBeTruthy();
      // Hardcoding the host is a bit risky but this should always be true in  test environment
      expect(link.href).toBe("http://localhost/" + slug);
    });

    it("has some styling on it", () => {
      const element = screen.getByText(title);
      // This is a bit brittle, but we sometimes lose the styled-jsx styles on the item, and react testing library doesn't make it easy to test for a jsx-* class name
      expect(element).toHaveStyle(`font-size: ${theme.blog.h1.size}`);
    });

    it("renders the type", () => {
      expect(screen.getByText("blog")).toBeTruthy();
    });

    it("renders the category", () => {
      expect(screen.getByText("dull-stuff")).toBeTruthy();
    });
  });

  describe("for an external publication", () => {
    const url = "http://somewhere.else";
    const slug = "should-still-use";

    beforeEach(() => {
      const post = {
        excerpt,
        fields: {
          title,
          cover,
          slug,
          prefix: "2020-01-06",
          category: "dull-stuff",
          author: "tdd-er"
        },
        frontmatter: {
          url
        }
      };

      const tree = render(<Item key="some-key" theme={theme} post={post} />);
    });

    it("renders the title", () => {
      expect(screen.getByText(title)).toBeTruthy();
    });

    it("renders the excerpt", () => {
      expect(screen.getByText(excerpt)).toBeTruthy();
    });

    it("renders the author", () => {
      expect(screen.getByText(author)).toBeTruthy();
    });

    it("renders the correct link", () => {
      const link = screen.getByRole("link");
      expect(link).toBeTruthy();
      expect(link.href).toBe("http://localhost/" + slug);
    });

    it("has some styling on it", () => {
      const element = screen.getByText(title);
      // This is a bit brittle, but we sometimes lose the styled-jsx styles on the item, and react testing library doesn't make it easy to test for a jsx-* class name
      expect(element).toHaveStyle(`font-size: ${theme.blog.h1.size}`);
    });
  });
});
