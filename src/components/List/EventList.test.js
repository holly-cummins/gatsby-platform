import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";

import EventList from "./EventList";

import theme from "../../theme/theme.yaml";

describe("EventList", () => {
  const title = "some post";
  const slug = "sluggaroo";
  const node = {
    node: {
      frontmatter: { category: "test-stuff", title, event: "QuackCon" },
      fields: { source: "some-source", slug, shortDate: "05-08" }
    }
  };
  const edges = [node];
  let listener;

  describe("in default config", () => {
    beforeEach(() => {
      listener = jest.fn();
      render(<EventList edges={edges} theme={theme} listener={listener} />);
    });

    it("renders the title", () => {
      expect(screen.getByText(title)).toBeTruthy();
    });

    it("renders the event name", () => {
      expect(screen.getByText("QuackCon")).toBeTruthy();
    });

    it("renders the date if the property is set", () => {
      expect(screen.getByText("QuackCon")).toBeTruthy();
    });

    it("renders the correct link", () => {
      const link = screen.getByRole("link");
      expect(link).toBeTruthy();
      // Hardcoding the host is a bit risky but this should always be true in  test environment
      expect(link.href).toBe("http://localhost/" + slug);
    });

    it("calls a listener on hover", () => {
      expect(listener).toHaveBeenCalledTimes(0);
      const eventText = screen.getByText("QuackCon");
      fireEvent.mouseOver(eventText);

      expect(listener).toHaveBeenCalledTimes(1);
    });

    it("calls a listener on unhover", () => {
      expect(listener).toHaveBeenCalledTimes(0);
      const eventText = screen.getByText("QuackCon");
      fireEvent.mouseOver(eventText);
      expect(listener).toHaveBeenCalledTimes(1);
      fireEvent.mouseOut(eventText);
      expect(listener).toHaveBeenCalledTimes(2);
    });
  });
  describe("when show date is set", () => {
    beforeEach(() => {
      listener = jest.fn();
      render(<EventList edges={edges} theme={theme} listener={listener} showDate={true} />);
    });

    it("renders the title", () => {
      expect(screen.getByText(title)).toBeTruthy();
    });

    it("does not renders the event name", () => {
      expect(screen.queryByText("QuackCon")).toBeFalsy();
    });

    it("renders the date", () => {
      expect(screen.getByText("05-08")).toBeTruthy();
    });

    it("calls a listener on hover", () => {
      expect(listener).toHaveBeenCalledTimes(0);
      const eventText = screen.getByText("05-08");
      fireEvent.mouseOver(eventText);

      expect(listener).toHaveBeenCalledTimes(1);
    });

    it("calls a listener on unhover", () => {
      expect(listener).toHaveBeenCalledTimes(0);
      const eventText = screen.getByText("05-08");
      fireEvent.mouseOver(eventText);
      expect(listener).toHaveBeenCalledTimes(1);
      fireEvent.mouseOut(eventText);
      expect(listener).toHaveBeenCalledTimes(2);
    });
  });
});
