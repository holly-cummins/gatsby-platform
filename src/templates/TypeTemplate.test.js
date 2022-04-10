import React from "react";
import { render, screen } from "@testing-library/react";

import TypeTemplate from "./TypeTemplate";

import { ThemeContext } from "../layouts";

import theme from "../theme/theme.yaml";
import { setToProd, restoreOldEnvironment } from "../utils/filters.test";

// @see https://testing-library.com/docs/react-testing-library/setup#custom-render
const renderWithTheme = ui => {
  return render(<ThemeContext.Provider value={theme}>{ui}</ThemeContext.Provider>);
};

describe("TypeTemplate", () => {
  const title = "some post";
  const draftTitle = "a partial post";

  const totalCount = 42;
  const slug = "sluggaroo";
  const node = {
    node: {
      frontmatter: { type: "dance-off", title },
      fields: { source: "some-source", slug, prefix: "2019-05-25" }
    }
  };

  const draftNode = {
    node: {
      frontmatter: { type: "bake-off", title: draftTitle },
      fields: { source: "another-source", slug: "half-baked-slug", prefix: "draft" }
    }
  };

  const post1 = {
    node: {
      fields: {
        slug: "/slug1/",
        prefix: "2020-10-10"
      },
      frontmatter: {
        title: "title1"
      }
    }
  };
  const post2 = {
    node: {
      fields: {
        slug: "pub2",
        prefix: "2003-03-06"
      },
      frontmatter: {
        title: "another title"
      }
    }
  };
  const post3 = {
    node: {
      fields: {
        slug: "pub",
        prefix: "2011-06-08"
      },
      frontmatter: {
        title: "a june title"
      }
    }
  };

  const post4 = {
    node: {
      fields: {
        slug: "pub4",
        prefix: "2011-10-07"
      },
      frontmatter: {
        title: "a october title"
      }
    }
  };
  const post5 = {
    node: {
      fields: {
        slug: "pub2",
        prefix: "2011-03-07"
      },
      frontmatter: {
        title: "a march title"
      }
    }
  };

  describe("for a collection with no elements", () => {
    const type = "podcast";
    const edges = [];
    const data = {
      allMarkdownRemark: { totalCount, edges }
    };

    beforeEach(() => {
      renderWithTheme(<TypeTemplate data={data} pageContext={{ type }} />);
    });

    it("does not render any years", async () => {
      expect(screen.queryByText(2020)).toBeFalsy();
      expect(screen.queryByText(2019)).toBeFalsy();
      expect(screen.queryByText(2011)).toBeFalsy();
      expect(screen.queryByText(2003)).toBeFalsy();
    });

    it("renders the icon on the title", () => {
      // We could try and dig into the HMTL to find the exact image source, but let's trust the icon sets the right alt text
      const title = type + " icon";
      expect(screen.getByTitle(title)).toBeTruthy();
    });
  });

  describe("for a collection with one matching element", () => {
    const type = "podcast";
    const edges = [node];
    const data = {
      allMarkdownRemark: { totalCount, edges }
    };

    beforeEach(() => {
      renderWithTheme(<TypeTemplate data={data} pageContext={{ type }} />);
    });

    it("renders the title", () => {
      expect(screen.getByText(title)).toBeTruthy();
    });

    it("renders a list", () => {
      // Coupling to the internals of List, but we need some way to make sure the right one is included
      expect(screen.getByTestId("post-list-wrapper")).toBeTruthy();
    });

    it("does not render any years", async () => {
      expect(screen.queryByText(2020)).toBeFalsy();
      expect(screen.queryByText(2019)).toBeFalsy();
      expect(screen.queryByText(2011)).toBeFalsy();
      expect(screen.queryByText(2003)).toBeFalsy();
    });
  });

  describe("for a collection with multiple elements", () => {
    const type = "podcast";
    const edges = [draftNode, node, post1, post2, post3, post4, post5];
    const data = {
      allMarkdownRemark: { totalCount, edges }
    };

    beforeEach(() => {
      renderWithTheme(<TypeTemplate data={data} pageContext={{ type }} />);
    });

    it("renders the title", () => {
      expect(screen.getByText(title)).toBeTruthy();
    });

    it("renders the draft title", async () => {
      expect(screen.getByText(draftTitle)).toBeTruthy();
    });

    it("renders several lists", () => {
      // Coupling to the internals of List, but we need some way to make sure the right one is included
      expect(screen.getAllByTestId("post-list-wrapper")).toHaveLength(5);
    });

    it("renders the years", async () => {
      expect(screen.getByText(2020)).toBeTruthy();
      expect(screen.getByText(2019)).toBeTruthy();
    });

    it("renders the years in the right order", async () => {
      const expectedOrder = ["unpublished", "2020", "2019", "2011", "2003"];
      const elements = screen.getAllByRole("heading", { level: 2 });
      expect(Array.from(elements).map(el => el.textContent)).toMatchObject(expectedOrder);
    });

    it("renders the elements within a year in the right order", async () => {
      const expectedOrder = ["a october title", "a june title", "a march title"];
      const elements = screen.getAllByText(/a .* title/);
      expect(Array.from(elements).map(el => el.textContent)).toMatchObject(expectedOrder);
    });

    it("does not show the type icons on the list elements", async () => {
      // We could try and dig into the HMTL to find the exact image source, but let's trust the icon sets the right alt text
      // Length should be one - one for the title, and then no others
      expect(screen.getAllByTitle(/.*icon/)).toHaveLength(1);
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
        const links = screen.getAllByRole("link");
        const link = links.find(link => link.text === title);
        expect(link).toBeTruthy();
        // Hardcoding the host is a bit risky but this should always be true in  test environment
        expect(link.href).toBe("http://localhost/" + slug);
      });

      it("filters out drafts", async () => {
        expect(screen.queryByText(draftTitle)).toBeFalsy();
      });

      it("renders several lists", () => {
        // Coupling to the internals of List, but we need some way to make sure the right one is included
        expect(screen.getAllByTestId("post-list-wrapper")).toHaveLength(4);
      });

      it("renders the years in the right order", async () => {
        const expectedOrder = ["2020", "2019", "2011", "2003"];
        const elements = screen.getAllByRole("heading", { level: 2 });
        expect(Array.from(elements).map(el => el.textContent)).toMatchObject(expectedOrder);
      });
    });

    describe("for a collection of external media", () => {
      const type = "media";

      beforeEach(() => {
        renderWithTheme(<TypeTemplate data={data} pageContext={{ type }} />);
      });

      it("renders lists with logos", () => {
        // Coupling to the internals of List, but we need some way to make sure the right one is included
        expect(screen.getAllByTestId("logo-list-wrapper")).toHaveLength(5);
      });
    });
  });
});
