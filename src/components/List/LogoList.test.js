import React from "react";
import { render, screen } from "@testing-library/react";

import LogoList from "./LogoList";

import theme from "../../theme/theme.yaml";

describe("LogoList", () => {
  describe("for an internal post", () => {
    const title = "some post";
    const slug = "sluggaroo";
    const node = {
      node: {
        frontmatter: { category: "test-stuff", title },
        fields: { source: "some-source", slug }
      }
    };
    const edges = [node];

    beforeEach(() => {
      const tree = render(<LogoList edges={edges} theme={theme} />);
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
    const url = "http://elsewhere.com";
    const node = {
      node: {
        frontmatter: { category: "test-stuff", title, url },
        fields: { source: "some-source", slug }
      }
    };
    const edges = [node];

    beforeEach(() => {
      const tree = render(<LogoList edges={edges} theme={theme} />);
    });

    it("renders the title", () => {
      expect(screen.getByText(title)).toBeTruthy();
    });

    it("renders the correct link", () => {
      const link = screen.getByRole("link");
      expect(link).toBeTruthy();
      expect(link.href).toBe(url + "/");
    });
  });
});
