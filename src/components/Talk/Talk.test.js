import React from "react";
import { render, screen } from "@testing-library/react";
import Talk from ".";

import theme from "../../theme/theme.yaml";

// Mock out things with static queries
// eslint-disable-next-line react/display-name
jest.mock("../Post/Author.js", () => () => <></>);

describe("Talk", () => {
  const title = "an amazing presentation";

  describe("with successful pre-processing", () => {
    const post = {
      frontmatter: {
        category: "test-stuff",
        type: "talk",
        author: "bob"
      },
      fields: {
        prefix: "prefixeroo",
        slug: "sluggeroo",
        title,
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

    it("renders the title", () => {
      render(<Talk post={post} next={next} prev={prev} authornote={authorNote} theme={theme} />);
      expect(screen.getByText(title)).toBeTruthy();
    });

    it("embeds the video", () => {
      render(<Talk post={post} next={next} prev={prev} authornote={authorNote} theme={theme} />);
      expect(screen.getByText("an embedded video")).toBeTruthy();
    });
  });

  describe("with missing oembed data", () => {
    const post = {
      frontmatter: {
        category: "test-stuff",
        type: "talk",
        author: "bob"
      },
      fields: {
        title,
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
