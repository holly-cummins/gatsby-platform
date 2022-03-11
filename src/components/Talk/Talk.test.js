import React from "react";
import { render, screen } from "@testing-library/react";
import Talk from ".";

import theme from "../../theme/theme.yaml";

describe("Talk", () => {
  const title = "an amazing presentation";

  describe("with successful pre-processing", () => {
    const post = {
      frontmatter: {
        category: "test-stuff",
        title,
        type: "talk",
        author: "bob",
        video: {
          url: "http://somewhere",
          title: "an amazing video",
          html: "<p>an embedded video</p>"
        }
      },
      fields: { prefix: "prefixeroo", slug: "sluggeroo" }
    };
    const next = { c: "c" };
    const prev = { a: "a" };
    const authorNote = "<p>an amazing author</a>";

    it("renders the title", () => {
      const tree = render(
        <Talk post={post} next={next} prev={prev} authornote={authorNote} theme={theme} />
      );
      expect(screen.getByText(title)).toBeTruthy();
    });

    it("embeds the video", () => {
      const tree = render(
        <Talk post={post} next={next} prev={prev} authornote={authorNote} theme={theme} />
      );
      expect(screen.getByText("an embedded video")).toBeTruthy();
    });
  });

  describe("with missing oembed data", () => {
    const post = {
      frontmatter: {
        category: "test-stuff",
        title,
        type: "talk",
        author: "bob"
      },
      fields: { prefix: "prefixeroo", slug: "sluggeroo" }
    };
    const next = { c: "c" };
    const prev = { a: "a" };
    const authorNote = "<p>an amazing author</a>";

    it("handles the missing fields gracefully", () => {
      const tree = render(
        <Talk post={post} next={next} prev={prev} authornote={authorNote} theme={theme} />
      );
      expect(screen.getByText(title)).toBeTruthy();
    });
  });
});
