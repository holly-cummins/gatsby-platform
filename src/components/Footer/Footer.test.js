import React from "react";
import { render, screen } from "@testing-library/react";

import Footer from ".";

import themeObjectFromYaml from "../../theme/theme.yaml";

describe("Footer", () => {
  it("renders something with a footers role", () => {
    render(<Footer htmlAst={{ type: "root", children: [] }} theme={themeObjectFromYaml} />);
    expect(screen.getByRole("contentinfo")).toBeTruthy();
  });

  it("renders the html ast argument", () => {
    const text = "this is the displayed text";
    const htmlAst = {
      type: "root",
      children: [
        {
          type: "element",
          tagName: "p",
          properties: {},
          children: [
            {
              type: "text",
              value: text
            }
          ]
        }
      ]
    };
    render(<Footer htmlAst={htmlAst} theme={themeObjectFromYaml} />);
    expect(screen.getByText(text)).toBeTruthy();
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
    render(<Footer htmlAst={htmlAst} theme={themeObjectFromYaml} />);
    expect(screen.getByTitle(type)).toBeTruthy();
  });
});
