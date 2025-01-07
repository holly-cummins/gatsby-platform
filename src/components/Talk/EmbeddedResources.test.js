import React from "react";
import { render, screen } from "@testing-library/react";
import EmbeddedResources from "./EmbeddedResources";

describe("EmbeddedResources", () => {
  describe("with populated content", () => {
    const title = "content";
    const embeds = [{ html: "<p>hi</p>", title }];

    beforeEach(() => {
      render(<EmbeddedResources oembeds={embeds} />);
    });
    it("renders the title", () => {
      expect(screen.getByText(title)).toBeTruthy();
    });
  });

  describe("with no embeds", () => {
    beforeEach(() => {
      render(<EmbeddedResources />);
    });

    // Dummy test to force rendering
    it("renders something", () => {
    });
  });
});
