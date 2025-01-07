import React from "react";
import { render, screen } from "@testing-library/react";
import Resources from "./Resources";

describe("A Resources section", () => {
  describe("with populated content", () => {
    const title = "content";
    const url = "http://someresources/";
    const resources = [{ url, title }];

    beforeEach(() => {
      render(<Resources resources={resources} />);
    });

    it("renders the title", () => {
      expect(screen.getByText(title)).toBeTruthy();
    });

    it("renders the resources as a link", () => {
      const link = screen.getByText(title);
      expect(link.href).toBe(url);
    });
  });

  describe("with no resources", () => {
    beforeEach(() => {
      render(<Resources />);
    });

    // Dummy test to force rendering
    // eslint-disable-next-line jest/expect-expect
    it("renders something", () => {
    });
  });
});
