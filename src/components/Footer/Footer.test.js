import React from "react";
import { render, screen } from "@testing-library/react";

import Footer from ".";

import themeObjectFromYaml from "../../theme/theme.yaml";

describe("Footer", () => {
  it("renders something with a footers role", () => {
    render(<Footer theme={themeObjectFromYaml} />);
    expect(screen.getByRole("contentinfo")).toBeTruthy();
  });

  it("renders an author name", () => {
    render(<Footer theme={themeObjectFromYaml} />);
    expect(screen.getByText("built by ducky devine")).toBeTruthy();
  });

  it("renders a social media link", () => {
    render(<Footer theme={themeObjectFromYaml} />);
    expect(screen.getByText("twitter")).toBeTruthy();
  });

  it("renders an icon", () => {
    const type = "rss";
    const htmlAst = {
      type: "root",
      children: [
        {
          type: "element",
          tagName: "rss"
        }
      ]
    };
    render(<Footer theme={themeObjectFromYaml} />);
    expect(screen.getByTitle(type)).toBeTruthy();
  });
});
