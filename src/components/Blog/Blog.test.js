import React from "react";
import { render, screen } from "@testing-library/react";
import { v4 as uuid } from "uuid";

import Blog from ".";

import themeObjectFromYaml from "../../theme/theme.yaml";
import { cover } from "../../../__mocks__/site.js";

const makeNode = () => {
  const title = "Test Item";

  return {
    node: {
      excerpt: "this is a lovely test…",
      fields: {
        title,
        slug: "sluggy" + uuid(),
        prefix: "2020-01-06",
        cover,
        author: "tdd-er"
      },
      frontmatter: {
        category: "dull-stuff"
      }
    }
  };
};

describe("Blog", () => {
  it("renders an item for each post", () => {
    const posts = [makeNode(), makeNode()];

    const tree = render(<Blog theme={themeObjectFromYaml} posts={posts} />);

    expect(screen.getByRole("list")).toBeTruthy();
    // There should be a list item for each post
    expect(screen.getAllByRole("listitem").length).toBe(posts.length);
  });
});
