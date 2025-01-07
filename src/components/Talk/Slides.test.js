import React from "react";
import { render, screen } from "@testing-library/react";
import Slides from "./Slides";

describe("Slides", () => {
  describe("with populated content", () => {
    const title = "content";
    const slides = { html: "<p>hi</p>", title };

    beforeEach(() => {
      render(<Slides slides={slides} />);
    });
    it("renders the title", () => {
      expect(screen.getByText(title)).toBeTruthy();
    });
  });

  describe("with no slides", () => {
    beforeEach(() => {
      render(<Slides />);
    });

    // Dummy test to force rendering
    it("renders something", () => {
    });
  });
});
