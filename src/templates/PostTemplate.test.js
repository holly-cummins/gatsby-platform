import React from "react";
import { render, screen } from "@testing-library/react";

import PostTemplate from "./PostTemplate";

import { ThemeContext } from "../layouts";

import themeObjectFromYaml from "../theme/theme.yaml";

// @see https://testing-library.com/docs/react-testing-library/setup#custom-render
const renderWithTheme = ui => {
  return render(<ThemeContext.Provider value={themeObjectFromYaml}>{ui}</ThemeContext.Provider>);
};

describe("PostTemplate", () => {
  it("renders the title", () => {
    const authorNote = "author-note";
    const slug = "sluggeroo";
    const title = "some post";
    const post = {
      frontmatter: { category: "test-stuff", title, author: "bob" },
      fields: { prefix: "prefixeroo", slug },
      html: "post-content"
    };
    const data = {
      post,
      authornote: { html: authorNote }
    };

    const tree = renderWithTheme(<PostTemplate data={data} pageContext={{}} />);
    expect(screen.getByText(title)).toBeTruthy();
  });
});
