import React from "react";
import { render, screen } from "@testing-library/react";
import { plural, icon } from "./type";

describe("the type descriptions", () => {
  it("pluralises correctly in the simple case", async () => {
    expect(plural("book")).toBe("books");
  });

  it("pluralises correctly for media", async () => {
    expect(plural("media")).toBe("media");
  });

  it("returns a good podcast icon", async () => {
    // This is an ugly internal coupling, but it allows us to test the linking
    expect(icon("podcast").type.render.name).toBe("Microphone20");
  });
});
