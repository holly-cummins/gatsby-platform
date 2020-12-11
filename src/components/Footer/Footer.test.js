import React from "react";
import { render, screen } from "@testing-library/react";

import Footer from ".";

import themeObjectFromYaml from "../../theme/theme.yaml";

describe("Footer", () => {
  it("renders something with a footers role", () => {
    render(<Footer html="" theme={themeObjectFromYaml} />);
    expect(screen.findByRole("contentinfo")).toBeTruthy();
  });

  it("renders the html argument", () => {
    const text = "this is the displayed text";
    render(<Footer html={`<h2>${text}</h2>`} theme={themeObjectFromYaml} />);
    expect(screen.findByText(text)).toBeTruthy();
  });
});
