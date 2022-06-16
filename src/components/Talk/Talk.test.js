import React from "react";
import { render, screen } from "@testing-library/react";
import Talk from ".";

import theme from "../../theme/theme.yaml";

// Mock out things with static queries
// eslint-disable-next-line react/display-name
jest.mock("../Post/Author.js", () => () => <></>);

describe("Talk", () => {
  const title = "an amazing presentation";
  const category = "test-stuff";
  const displayCategory = "TeSt-StUfF";

  describe("with successful pre-processing", () => {
    const post = {
      frontmatter: {
        type: "talk",
        code: [{ url: "http://somegitrepo.com" }]
      },
      fields: {
        prefix: "prefixeroo",
        slug: "sluggeroo",
        author: "bob",
        title,
        category,
        displayCategory,
        video: {
          url: "http://somewhere",
          title: "an amazing video",
          html: "<p>an embedded video</p>"
        }
      },
      html: "<p>hello</p>"
    };
    const next = { c: "c" };
    const prev = { a: "a" };
    const authorNote = "<p>an amazing author</a>";

    beforeEach(() => {
      render(<Talk post={post} next={next} prev={prev} authornote={authorNote} theme={theme} />);
    });

    it("renders the title", () => {
      expect(screen.getByText(title)).toBeTruthy();
    });

    it("embeds the video", () => {
      expect(screen.getByText("an embedded video")).toBeTruthy();
    });

    it("includes a code section", () => {
      expect(screen.getByText("Code")).toBeTruthy();
    });

    it("includes a code link", () => {
      expect(screen.getByText("http://somegitrepo.com")).toBeTruthy();
    });

    it("renders the category", () => {
      expect(screen.getByText(displayCategory)).toBeTruthy();
    });

    it("renders the author", () => {
      expect(screen.getByText("bob")).toBeTruthy();
    });

    it("uses the normalised category for the link", () => {
      const categoryElement = screen.getByText(displayCategory);
      expect(categoryElement.getAttribute("href")).toMatch(new RegExp(".*/" + category + "$"));
    });
  });

  describe("with missing oembed data", () => {
    const post = {
      frontmatter: {
        type: "talk"
      },
      fields: {
        title,
        author: "bob",
        category: "test-stuff",
        displayCategory: "test-stuff",
        prefix: "prefixeroo",
        slug: "sluggeroo"
      },
      html: "<p>hello</p>"
    };
    const next = { c: "c" };
    const prev = { a: "a" };
    const authorNote = "<p>an amazing author</a>";

    it("handles the missing fields gracefully", () => {
      render(<Talk post={post} next={next} prev={prev} authornote={authorNote} theme={theme} />);
      expect(screen.getByText(title)).toBeTruthy();
    });
  });
});
