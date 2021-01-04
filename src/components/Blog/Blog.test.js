import React from "react";
import { render, screen } from "@testing-library/react";

import Blog from ".";

import themeObjectFromYaml from "../../theme/theme.yaml";
import { v4 as uuid } from "uuid";

const makeNode = () => {
  const title = "Test Item";

  return {
    node: {
      excerpt: "this is a lovely test…",
      fields: { slug: "sluggy" + uuid(), prefix: "2020-01-06" },
      frontmatter: {
        title,
        category: "dull-stuff",
        author: "tdd-er",
        cover: {
          children: [
            {
              fluid: {
                base64: "data:image/png;base64,iV==",
                aspectRatio: 1,
                src: "/static/somewhere.png",
                srcSet: "/static/somewhere.png 75w",
                sizes: "(max-width: 300px) 100vw, 300px"
              }
            }
          ]
        }
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
