import React from "react";
import { render, screen } from "@testing-library/react";
import Video from "./Video";

describe("Video", () => {
  describe("with populated content", () => {
    const title = "content";
    const video = { html: "<p>hi</p>", title };

    beforeEach(() => {
      render(<Video video={video} />);
    });
    it("renders the title", () => {
      expect(screen.getByText(title)).toBeTruthy();
    });
  });

  describe("with no video", () => {
    beforeEach(() => {
      render(<Video />);
    });

    // Dummy test to force rendering
    it("renders something", () => {
    });
  });
});
