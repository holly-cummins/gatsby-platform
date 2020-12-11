import React from "react";
import { render, screen } from "@testing-library/react";
import Header from ".";

import themeObjectFromYaml from "../../theme/theme.yaml";

describe("Header", () => {
  it("renders the title", () => {
    const title = "Test Instance";

    const tree = render(
      <Header
        siteTitle={title}
        theme={themeObjectFromYaml}
        pages={[{ node: { frontmatter: { menuTitle: "", title: "" }, fields: { slug: "" } } }]}
        path="/"
      />
    );
    expect(screen.findByText(title)).toBeTruthy();
  });
});
