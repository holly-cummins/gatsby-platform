import React from "react";
import { render, screen } from "@testing-library/react";
import Item from "./Item";

import themeObjectFromYaml from "../../theme/theme.yaml";

describe("Item", () => {
  it("renders the title", () => {
    const title = "Some Test Item";
    const excerpt = "this is a lovely test…";
    const author = "tdd-er";
    const post = {
      excerpt,
      fields: { slug: "sluggy", prefix: "2020-01-06" },
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
    };

    const tree = render(<Item key="some-key" theme={themeObjectFromYaml} post={post} />);
    expect(screen.getByText(title)).toBeTruthy();
    expect(screen.getByText(excerpt)).toBeTruthy();
    expect(screen.getByText(author)).toBeTruthy();
  });
});
