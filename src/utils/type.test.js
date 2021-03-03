import React from "react";
import { render, screen } from "@testing-library/react";
import { plural, icon } from "./type";

describe("the type descriptions", () => {
  describe("pluralisation", () => {
    it("pluralises correctly in the simple case", async () => {
      expect(plural("book")).toBe("books");
    });

    it("pluralises correctly for media", async () => {
      expect(plural("media")).toBe("media");
    });
  });
  describe("icons", () => {
    it("handles a good podcast icon", async () => {
      // This is an ugly internal coupling, but it allows us to test the linking
      expect(icon("podcast").render.name).toBe("Microphone20");
    });

    it("returns a reasonable icon for an unknown type", async () => {
      // This is an ugly internal coupling, even uglier since we may change our mind about what we use for unknown,
      // but it allows us to test the linking
      expect(icon("iced bun").render.name).toBe("LicenseGlobal20");
    });
  });
});
