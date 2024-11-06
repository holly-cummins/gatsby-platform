import React from "react";
import { render, screen } from "@testing-library/react";

import PageTemplate from "./PageTemplate";

describe("PageTemplate", () => {
  it("renders the title", () => {
    const html = "html";
    const slug = "sluggeroo";
    const title = "some page";
    const page = {
      frontmatter: { category: "test-stuff", title },
      fields: { source: "pages", slug },
      html
    };
    const data = {
      page
    };

    const tree = render(<PageTemplate data={data} />);
    expect(screen.getByText(title)).toBeTruthy();
  });
});
