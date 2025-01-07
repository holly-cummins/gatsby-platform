import React from "react";
import { render, screen } from "@testing-library/react";
import Meta from "./Meta";

describe("Meta", () => {
  describe("with no event", () => {
    const category = "stuff";
    const displayCategory = "sTUff";

    const prefix = "2022-02-22";
    const author = "snacky devine";

    beforeEach(() => {
      render(
        <Meta
          prefix={prefix}
          author={author}
          category={category}
          displayCategory={displayCategory}

        />
      );
    });

    it("renders the author", () => {
      expect(screen.getByText(author)).toBeTruthy();
    });

    it("renders the date", () => {
      expect(screen.getByText(prefix)).toBeTruthy();
    });

    it("renders the category", () => {
      expect(screen.getByText(displayCategory)).toBeTruthy();
    });

    it("uses the normalised category for the link", () => {
      const categoryElement = screen.getByText(displayCategory);
      expect(categoryElement.getAttribute("href")).toMatch(new RegExp(".*/" + category + "$"));
    });
  });

  describe("with an event", () => {
    const category = "things";
    const displayCategory = "things and sausages";
    const prefix = "2021-03-22";
    const author = "snacky malone";
    const event = "DuckCon";

    beforeEach(() => {
      render(
        <Meta
          prefix={prefix}
          author={author}
          category={category}
          displayCategory={displayCategory}
          event={event}

        />
      );
    });
    it("renders the author", () => {
      expect(screen.getByText(author)).toBeTruthy();
    });

    it("renders the date", () => {
      expect(screen.getByText(prefix)).toBeTruthy();
    });

    it("renders the category", () => {
      expect(screen.getByText(displayCategory)).toBeTruthy();
    });

    it("renders the event", () => {
      expect(screen.getByText(event)).toBeTruthy();
    });

    it("does not say anything about keynotes", () => {
      expect(screen.queryByText("keynote")).toBeNull();
    });
  });

  describe("with a keynote talk", () => {
    const category = "things";
    const displayCategory = "pancakes and sausages";
    const prefix = "2021-03-22";
    const author = "snacky malone";
    const event = "DuckCon";

    beforeEach(() => {
      render(
        <Meta
          prefix={prefix}
          author={author}
          category={category}
          displayCategory={displayCategory}
          event={event}
          keynote={true}

        />
      );
    });
    it("renders the author", () => {
      expect(screen.getByText(author)).toBeTruthy();
    });

    it("renders the date", () => {
      expect(screen.getByText(prefix)).toBeTruthy();
    });

    it("renders the category", () => {
      expect(screen.getByText(displayCategory)).toBeTruthy();
    });

    it("renders the event", () => {
      expect(screen.getByText(event)).toBeTruthy();
    });

    it("lists that this is a keynote", () => {
      expect(screen.queryByText("keynote")).toBeTruthy();
    });
  });
});
