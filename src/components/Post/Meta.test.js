import React from "react";
import { render, screen } from "@testing-library/react";
import Meta from "./Meta";

import theme from "../../theme/theme.yaml";

describe("Meta", () => {
  describe("with no event", () => {
    const category = "stuff";
    const prefix = "2022-02-22";
    const author = "snacky devine";

    beforeEach(() => {
      render(<Meta prefix={prefix} author={author} category={category} theme={theme} />);
    });
    it("renders the author", () => {
      expect(screen.getByText(author)).toBeTruthy();
    });

    it("renders the date", () => {
      expect(screen.getByText(prefix)).toBeTruthy();
    });

    it("renders the category", () => {
      expect(screen.getByText(category)).toBeTruthy();
    });
  });

  describe("with an event", () => {
    const category = "things";
    const prefix = "2021-03-22";
    const author = "snacky malone";
    const event = "DuckCon";

    beforeEach(() => {
      render(
        <Meta prefix={prefix} author={author} category={category} event={event} theme={theme} />
      );
    });
    it("renders the author", () => {
      expect(screen.getByText(author)).toBeTruthy();
    });

    it("renders the date", () => {
      expect(screen.getByText(prefix)).toBeTruthy();
    });

    it("renders the category", () => {
      expect(screen.getByText(category)).toBeTruthy();
    });

    it("renders the event", () => {
      expect(screen.getByText(event)).toBeTruthy();
    });
  });
});
