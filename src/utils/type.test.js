import React from "react";
import { render, screen, prettyDOM } from "@testing-library/react";
import { plural, icon, Icon } from "./type";

describe("the type descriptions", () => {
  describe("pluralisation", () => {
    it("pluralises correctly in the simple case", async () => {
      expect(plural("book")).toBe("books");
    });

    it("pluralises correctly for media", async () => {
      expect(plural("media")).toBe("media");
    });
  });

  describe("icon function", () => {
    it("handles a good podcast icon", async () => {
      const type = "podcast";
      const Component = icon(type);
      const rendered = render(<Component />);
      expect(rendered.container.querySelector("svg")).toBeTruthy();
      expect(rendered.container.querySelector("path")).toBeTruthy();
      // It would be nice to be more specific about the image contents but it's hard to do that without just copy pasting paths
    });

    it("returns a reasonable icon for an unknown type", async () => {
      const type = "iced bun";
      const Component = icon(type);
      const rendered = render(<Component />);
      expect(rendered.container.querySelector("svg")).toBeTruthy();
      expect(rendered.container.querySelector("path")).toBeTruthy();
      // It would be nice to be more specific about the image contents but it's hard to do that without just copy pasting paths
    });

    it("adds a title for accessibility", async () => {
      const type = "book";
      const Component = icon(type);
      const rendered = render(<Component />);
      expect(rendered.getByTitle(type + " icon")).toBeTruthy();
    });

    it("adds a correctly vague accessibility title when the image is not found", async () => {
      const type = "pie";
      const Component = icon(type);
      const rendered = render(<Component />);
      expect(rendered.getByTitle("unknown icon")).toBeTruthy();
    });
  });

  describe("icon component", () => {
    it("handles a good podcast icon", async () => {
      const type = "podcast";

      const { container } = render(<Icon type={type} />);
      expect(container.querySelector("svg")).toBeTruthy();
      expect(container.querySelector("path")).toBeTruthy();
    });

    it("returns a reasonable icon for an unknown type", async () => {
      const type = "iced bun";
      const { container } = render(<Icon type={type} />);
      expect(container.querySelector("svg")).toBeTruthy();
      expect(container.querySelector("path")).toBeTruthy();
    });

    it("adds a title for accessibility", async () => {
      const type = "book";
      render(<Icon type={type} />);
      expect(screen.getByTitle(type + " icon")).toBeTruthy();
    });

    it("adds a correctly vague accessibility title when the image is not found", async () => {
      const type = "houseplants";
      render(<Icon type={type} />);
      expect(screen.getByTitle("unknown icon")).toBeTruthy();
    });
  });
});
