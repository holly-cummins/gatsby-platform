import React from "react";
import { graphql, Link, StaticQuery } from "gatsby";
import { render, screen } from "@testing-library/react";
import { PureHeader as Header } from "./header";
import themeObjectFromYaml from "../../theme/theme.yaml";

const graphqldata = {
  file: {
    publicURL: "/static/longnumberstring/author.jpg"
  }
};

describe("Header", () => {
  it("renders the title", () => {
    const title = "Test Instance";

    const tree = render(
      <Header
        siteTitle="site title"
        theme={themeObjectFromYaml}
        pages={[{ node: { frontmatter: { menuTitle: "", title: title }, fields: { slug: "" } } }]}
        path="/"
        data={graphqldata}
      />
    );
    expect(screen.getByText(title)).toBeTruthy();
  });
});
