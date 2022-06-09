import React from "react";
import { render, screen } from "@testing-library/react";
import Code from "./Code";

import theme from "../../theme/theme.yaml";

describe("A Code section", () => {
  describe("with populated content", () => {
    const title = "content";
    const code = { url: "somecode", title };

    beforeEach(() => {
      render(<Code code={code} theme={theme} />);
    });

    it("renders the title", () => {
      expect(screen.getByText(title + ":")).toBeTruthy();
    });

    it("renders the code", () => {
      expect(screen.getByText("somecode")).toBeTruthy();
    });
  });

  describe("with no code", () => {
    beforeEach(() => {
      render(<Code theme={theme} />);
    });

    // Dummy test to force rendering
    // eslint-disable-next-line jest/expect-expect
    it("renders something", () => {});
  });
});
