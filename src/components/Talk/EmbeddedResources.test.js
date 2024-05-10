import React from "react";
import { render, screen } from "@testing-library/react";
import EmbeddedResources from "./EmbeddedResources";

import theme from "../../theme/theme.yaml";

describe("EmbeddedResources", () => {
  describe("with populated content", () => {
    const title = "content";
    const embeds = [{ html: "<p>hi</p>", title }];

    beforeEach(() => {
      render(<EmbeddedResources oembeds={embeds} theme={theme} />);
    });
    it("renders the title", () => {
      expect(screen.getByText(title)).toBeTruthy();
    });
  });

  describe("with no embeds", () => {
    beforeEach(() => {
      render(<EmbeddedResources theme={theme} />);
    });

    // Dummy test to force rendering
    it("renders something", () => {});
  });
});
