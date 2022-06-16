import React from "react";
import { render, screen } from "@testing-library/react";
import Post from ".";

import theme from "../../theme/theme.yaml";

// Mock out things with static queries
// eslint-disable-next-line react/display-name
jest.mock("../Post/Author.js", () => () => <></>);

describe("Post", () => {
  const title = "an amazing presentation";
  const category = "test-stuff";
  const displayCategory = "TeSt-StUfF";

  const post = {
    frontmatter: {
      type: "Post"
    },
    fields: {
      prefix: "prefixeroo",
      slug: "sluggeroo",
      title,
      author: "bob",
      category,
      displayCategory
    },
    html: "<p>hello</p>"
  };
  const next = { c: "c" };
  const prev = { a: "a" };
  const authorNote = "<p>an amazing author</a>";

  beforeEach(() => {
    render(<Post post={post} next={next} prev={prev} authornote={authorNote} theme={theme} />);
  });

  it("renders the title", () => {
    expect(screen.getByText(title)).toBeTruthy();
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

  it("renders the html", () => {
    expect(screen.getByText("hello")).toBeTruthy();
  });
});
