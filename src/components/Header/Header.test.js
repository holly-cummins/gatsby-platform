import React from "react";
import { render, screen } from "@testing-library/react";
import { PureHeader as Header } from "./Header";

const graphqldata = {
  file: {
    publicURL: "/static/longnumberstring/author.jpg"
  }
};

describe("Header", () => {
  it("renders the title", () => {
    const title = "Test Instance";

    render(
      <Header
        siteTitle="site title"
        pages={[{ node: { frontmatter: { menuTitle: "", title: title }, fields: { slug: "" } } }]}
        path="/"
        data={graphqldata}
      />
    );
    expect(screen.getByText(title)).toBeTruthy();
  });
});
