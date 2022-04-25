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
  const nodeDate = "2019-05-25";
  const shortDate = "05-25";

  const node = {
    node: {
      frontmatter: { type: "dance-off", title },
      fields: { source: "some-source", slug, prefix: nodeDate, shortDate }
    }
  };

  const draftNode = {
    node: {
      frontmatter: { type: "bake-off", title: draftTitle },
      fields: { source: "another-source", slug: "half-baked-slug", prefix: "draft" }
    }
  };

  const futureNode = {
    node: {
      frontmatter: { type: "bake-off", title: "a future title" },
      fields: { source: "another-source", slug: "psychic-slug", prefix: "2056-07-02" }
    }
  };

  const marchFutureNode = {
    node: {
      frontmatter: { type: "bake-off", title: "a march future" },
      fields: { source: "another-source", slug: "march-psychic-slug", prefix: "2054-03-02" }
    }
  };

  const octoberFutureNode = {
    node: {
      frontmatter: { type: "bake-off", title: "a october future" },
      fields: { source: "another-source", slug: "oct-psychic-slug", prefix: "2058-10-02" }
    }
  };

  const juneFutureNode = {
    node: {
      frontmatter: { type: "bake-off", title: "a june future" },
      fields: { source: "another-source", slug: "psychic-june-slug", prefix: "2057-06-02" }
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
        title: "another title",
        event: "DuckCon"
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
      const titleWithIcon = type + " icon";
      expect(screen.getByTitle(titleWithIcon)).toBeTruthy();
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

    it("renders the full date", async () => {
      expect(screen.getByText(nodeDate)).toBeTruthy();
    });
  });

  describe("for a collection with multiple elements", () => {
    const type = "podcast";
    const edges = [draftNode, futureNode, node, post1, post2, post3, post4, post5];
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

    it("renders the short date", async () => {
      expect(screen.getByText(shortDate)).toBeTruthy();
    });

    it("does not render the full date", async () => {
      expect(screen.queryByText(nodeDate)).toBeFalsy();
    });

    it("does not show list years in the future", async () => {
      // We could try and dig into the HMTL to find the exact image source, but let's trust the icon sets the right alt text
      // Length should be one - one for the title, and then no others
      expect(screen.queryByText(2056)).toBeFalsy();
    });

    it("does not show anything about upcoming", async () => {
      // We could try and dig into the HMTL to find the exact image source, but let's trust the icon sets the right alt text
      // Length should be one - one for the title, and then no others
      expect(screen.queryByText("upcoming")).toBeFalsy();
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
        const foundLink = links.find(link => link.text === title);
        expect(foundLink).toBeTruthy();
        // Hardcoding the host is a bit risky but this should always be true in  test environment
        expect(foundLink.href).toBe("http://localhost/" + slug);
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
      const mediaType = "media";

      beforeEach(() => {
        renderWithTheme(<TypeTemplate data={data} pageContext={{ mediaType }} />);
      });

      it("renders lists with logos", () => {
        // Coupling to the internals of List, but we need some way to make sure the right one is included
        expect(screen.getAllByTestId("logo-list-wrapper")).toHaveLength(5);
      });
    });
  });

  describe("for a collection with multiple elements and upcoming enabled", () => {
    // Upcoming is enabled for talks
    const type = "talk";

    const edges = [
      draftNode,
      marchFutureNode,
      futureNode,
      octoberFutureNode,
      juneFutureNode,
      node,
      post1,
      post2,
      post3,
      post4,
      post5
    ];
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
      expect(screen.getAllByTestId("event-list-wrapper")).toHaveLength(6);
    });

    it("renders lists with event names", () => {
      // Coupling to the internals of List, but we need some way to make sure the right one is included
      expect(screen.getByText("DuckCon")).toBeTruthy();
    });

    it("renders the years", async () => {
      expect(screen.getByText(2020)).toBeTruthy();
      expect(screen.getByText(2019)).toBeTruthy();
    });

    it("renders the years in the right order", async () => {
      const expectedOrder = ["upcoming", "unpublished", "2020", "2019", "2011", "2003"];
      const elements = screen.getAllByRole("heading", { level: 2 });
      expect(Array.from(elements).map(el => el.textContent)).toMatchObject(expectedOrder);
    });

    it("renders the elements within a year in the right order", async () => {
      const expectedOrder = ["a future title", "a october title", "a june title", "a march title"];
      const elements = screen.getAllByText(/a .* title/);
      expect(Array.from(elements).map(el => el.textContent)).toMatchObject(expectedOrder);
    });

    it("renders the elements within the future in the right order", async () => {
      const expectedOrder = [
        "a october future",
        "a june future",
        "a future title",
        "a march future"
      ];
      const elements = screen.getAllByText(/.*future.*/);
      expect(Array.from(elements).map(el => el.textContent)).toMatchObject(expectedOrder);
    });

    it("does not show list years in the future", async () => {
      // We could try and dig into the HMTL to find the exact image source, but let's trust the icon sets the right alt text
      // Length should be one - one for the title, and then no others
      expect(screen.queryByText(2056)).toBeFalsy();
    });

    it("has a section for upcoming", async () => {
      // We could try and dig into the HMTL to find the exact image source, but let's trust the icon sets the right alt text
      // Length should be one - one for the title, and then no others
      expect(screen.getByText("upcoming")).toBeTruthy();
    });

    it("does not show the type icons on the list elements", async () => {
      // We could try and dig into the HMTL to find the exact image source, but let's trust the icon sets the right alt text
      // Length should be one - one for the title, and then no others
      expect(screen.getAllByTitle(/.*icon/)).toHaveLength(1);
    });
  });
});
