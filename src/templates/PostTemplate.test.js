import React from "react";
import { render, screen } from "@testing-library/react";

import PostTemplate from "./PostTemplate";

import { ThemeContext } from "../layouts";

import themeObjectFromYaml from "../theme/theme.yaml";

// Mock out things with static queries
jest.mock("../components/Post/Author.js", () => () => <></>);

// @see https://testing-library.com/docs/react-testing-library/setup#custom-render
const renderWithTheme = ui => {
  return render(<ThemeContext.Provider value={themeObjectFromYaml}>{ui}</ThemeContext.Provider>);
};

describe("PostTemplate", () => {
  describe("for a generic post", () => {
    const authorNote = "author-note";
    const slug = "sluggeroo";
    const title = "some post";
    const body = "post-content";
    const post = {
      frontmatter: { category: "test-stuff", title, author: "bob" },
      fields: { prefix: "prefixeroo", slug },
      html: `<p>${body}</p>`
    };
    const data = {
      post,
      authornote: { html: authorNote }
    };

    // Why is this each? See https://stackoverflow.com/questions/67669213/react-testing-library-using-beforeall-to-render-cannot-find-item-on-2nd-test
    beforeEach(() => {
      const tree = renderWithTheme(<PostTemplate data={data} pageContext={{}} />);
    });

    it("renders the post body", () => {
      expect(screen.getByText(body)).toBeTruthy();
    });

    it("renders the title", () => {
      expect(screen.getByText(title)).toBeTruthy();
    });
  });

  describe("for a talk", () => {
    const authorNote = "author-note";
    const slug = "sluggeroo";
    const title = "an amazing presentation";
    const type = "talk";
    const event = "brilliant conference";
    const post = {
      frontmatter: { category: "test-stuff", title, type, event, author: "bob" },
      fields: { prefix: "prefixeroo", slug }
      // No html field for a talk
    };
    const data = {
      post,
      authornote: { html: authorNote }
    };

    // Why is this each? See https://stackoverflow.com/questions/67669213/react-testing-library-using-beforeall-to-render-cannot-find-item-on-2nd-test
    beforeEach(() => {
      const tree = renderWithTheme(<PostTemplate data={data} pageContext={{}} />);
    });

    it("renders the title", () => {
      expect(screen.getByText(title)).toBeTruthy();
    });

    // We test this mostly to make sure the right component was rendered
    it("renders the event name", () => {
      expect(screen.getByText(event)).toBeTruthy();
    });
  });
});
