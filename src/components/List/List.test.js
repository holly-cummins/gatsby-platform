import React from "react";
import { render, screen } from "@testing-library/react";

import List from "./List";

import theme from "../../theme/theme.yaml";

describe("List", () => {
  describe("for an internal post", () => {
    const title = "some post";
    const slug = "sluggaroo";
    const shortDate = "06-09";
    const prefix = "2020-06-09";
    const node = {
      node: {
        frontmatter: { category: "test-stuff" },
        fields: { title, source: "some-source", slug, prefix, shortDate }
      }
    };
    const edges = [node];

    beforeEach(() => {
      render(<List edges={edges} theme={theme} />);
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

    it("renders an icon", async () => {
      // We could try and dig into the HMTL to find the exact image source, but let's trust the icon sets the right alt text
      // Length should be one - one for the title, and then no others
      expect(screen.getByTitle(/.*icon/)).toBeTruthy();
    });

    it("renders the date, including a year", async () => {
      expect(screen.getByText(prefix)).toBeTruthy();
    });

    describe("with short dates specified", () => {
      const title = "some post";
      const slug = "sluggaroo";
      const shortDate = "05-09";
      const prefix = "2020-05-09";
      const node = {
        node: {
          frontmatter: { category: "test-stuff" },
          fields: { title, source: "some-source", slug, prefix, shortDate }
        }
      };
      const edges = [node];

      beforeEach(() => {
        render(<List edges={edges} theme={theme} useShortDate={true} />);
      });

      it("renders the date, without a year", async () => {
        expect(screen.queryByText(prefix)).toBeFalsy();
        expect(screen.getByText(shortDate)).toBeTruthy();
      });
    });
  });

  describe("for an external post", () => {
    const title = "another post";
    const slug = "actually-used-slug";
    const url = "http://elsewhere.com";
    const node = {
      node: {
        frontmatter: { category: "test-stuff", url },
        fields: { title, source: "some-source", slug }
      }
    };
    const edges = [node];

    beforeEach(() => {
      render(<List edges={edges} theme={theme} />);
    });

    it("renders the title", () => {
      expect(screen.getByText(title)).toBeTruthy();
    });

    it("renders the correct link", () => {
      const link = screen.getByRole("link");
      expect(link).toBeTruthy();
      expect(link.href).toBe("http://localhost/" + slug);
    });
  });

  describe("for an post with icons disabled", () => {
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
      render(<List edges={edges} theme={theme} showIcon={false} />);
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

    it("does not render an icon", async () => {
      // We could try and dig into the HMTL to find the exact image source, but let's trust the icon sets the right alt text
      expect(screen.queryByTitle(/.*icon/)).toBeNull();
    });
  });
});
