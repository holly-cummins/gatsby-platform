import React from "react";
import { render, screen } from "@testing-library/react";

import LogoList from "./LogoList";

describe("LogoList", () => {
  describe("for an internal post", () => {
    const title = "some post";
    const slug = "sluggaroo";
    const node = {
      node: {
        frontmatter: { category: "test-stuff" },
        fields: { title, source: "some-source", slug }
      }
    };
    const edges = [node];

    beforeEach(() => {
      render(<LogoList edges={edges} />);
    });

    it("renders the title", () => {
      expect(screen.getByText(title)).toBeTruthy();
    });

    it("renders the correct link", () => {
      const link = screen.getByRole("link");
      expect(link).toBeTruthy();
      // Hardcoding the host is a bit risky but this should always be true in  test environment
      expect(link.href).toBe("http://localhost/" + slug);
    });
  });

  describe("for an external post", () => {
    const title = "another post";
    const slug = "unused";
    const url = "http://forbes.com/something/something.html";
    const node = {
      node: {
        frontmatter: { category: "test-stuff", url },
        fields: { title, source: "some-source", slug }
      }
    };
    const edges = [node];

    beforeEach(() => {
      render(<LogoList edges={edges} />);
    });

    it("renders the title", () => {
      expect(screen.getByText(title)).toBeTruthy();
    });

    it("renders the correct link", () => {
      const link = screen.getByRole("link");
      expect(link).toBeTruthy();
      expect(link.href).toBe("http://localhost/" + slug);
    });

    it("includes a logo", () => {
      const logo = screen.getByAltText("forbes logo");
      expect(logo).toBeTruthy();
    });
  });
});
