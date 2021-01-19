import React from "react";
import { render, screen } from "@testing-library/react";
import Item from "./Item";

import themeObjectFromYaml from "../../theme/theme.yaml";
import { cover } from "../../../__mocks__/site.js";

describe("Item", () => {
  const title = "Some Test Item";
  const excerpt = "this is a lovely test…";
  const author = "tdd-er";
  const slug = "sluggy";

  beforeEach(() => {
    const post = {
      excerpt,
      fields: { slug, prefix: "2020-01-06" },
      frontmatter: {
        title,
        category: "dull-stuff",
        author: "tdd-er",
        cover
      }
    };

    const tree = render(<Item key="some-key" theme={themeObjectFromYaml} post={post} />);
  });

  it("renders the title", () => {
    expect(screen.getByText(title)).toBeTruthy();
  });

  it("renders the excerpt", () => {
    expect(screen.getByText(excerpt)).toBeTruthy();
  });

  it("renders the author", () => {
    expect(screen.getByText(author)).toBeTruthy();
  });

  it("renders the correct link", () => {
    const link = screen.getByRole("link");
    expect(link).toBeTruthy();
    // Hardcoding the host is a bit risk but this should always be true in  test environment
    expect(link.href).toBe("http://localhost/" + slug);
  });
});
