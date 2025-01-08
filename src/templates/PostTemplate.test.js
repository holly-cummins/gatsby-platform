import React from "react";
import { render, screen } from "@testing-library/react";

import PostTemplate from "./PostTemplate";

// Mock out things with static queries
jest.mock("../components/Post/Author.js", () => () => <></>);

describe("PostTemplate", () => {
  const category = "test-stuff";
  const displayCategory = "TeSt-StUfF";

  describe("for a generic post", () => {
    const authorNote = "author-note";
    const slug = "sluggeroo";
    const title = "some post";
    const body = "post-content";

    const post = {
      frontmatter: {},
      fields: {
        author: "bob",
        title,
        prefix: "prefixeroo",
        slug,
        category,
        displayCategory
      },
      html: `<p>${body}</p>`
    };
    const data = {
      post,
      authornote: { html: authorNote }
    };

    // Why is this each? See https://stackoverflow.com/questions/67669213/react-testing-library-using-beforeall-to-render-cannot-find-item-on-2nd-test
    beforeEach(() => {
      render(<PostTemplate data={data} pageContext={{}} />);
    });

    it("renders the post body", () => {
      expect(screen.getByText(body)).toBeTruthy();
    });

    it("renders the title", () => {
      expect(screen.getByText(title)).toBeTruthy();
    });

    it("renders the category", () => {
      expect(screen.getByText(displayCategory)).toBeTruthy();
    });
  });

  describe("for a talk", () => {
    const authorNote = "author-note";
    const slug = "sluggeroo";
    const title = "an amazing presentation";
    const type = "talk";
    const event = "brilliant conference";
    const post = {
      frontmatter: { type, event },
      fields: {
        author: "bob",
        title,
        prefix: "prefixeroo",
        slug,
        category,
        displayCategory
      },
      html: `<p>a talk abstract</p>`

      // No html field for a talk
    };
    const data = {
      post,
      authornote: { html: authorNote }
    };

    // Why is this each? See https://stackoverflow.com/questions/67669213/react-testing-library-using-beforeall-to-render-cannot-find-item-on-2nd-test
    beforeEach(() => {
      render(<PostTemplate data={data} pageContext={{}} />);
    });

    it("renders the title", () => {
      expect(screen.getByText(title)).toBeTruthy();
    });

    // We test this mostly to make sure the right component was rendered
    it("renders the event name", () => {
      expect(screen.getByText(event)).toBeTruthy();
    });

    it("renders the category", () => {
      expect(screen.getByText(displayCategory)).toBeTruthy();
    });
  });
});
