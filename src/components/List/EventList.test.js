import React from "react";
import { fireEvent, render, screen, cleanup } from "@testing-library/react";

import EventList from "./EventList";

describe("EventList", () => {
  let container;
  const title = "some post";
  const slug = "sluggaroo";
  const fields = { title, source: "some-source", slug, shortDate: "05-08" };

  const node = {
    node: {
      frontmatter: { category: "test-stuff", event: "QuackCon" },
      fields
    }
  };
  const edges = [node];
  let listener;

  describe("in default config", () => {
    beforeEach(() => {
      listener = jest.fn();
      const rendered = render(<EventList edges={edges} listener={listener} />);

      container = rendered.container;
    });

    it("renders the title", () => {
      expect(screen.getByText(title)).toBeTruthy();
    });

    it("renders the event name", () => {
      expect(screen.getByText("QuackCon")).toBeTruthy();
    });

    it("renders the event name if the property is set", () => {
      expect(screen.getByText("QuackCon")).toBeTruthy();
    });

    it("renders the correct link", () => {
      const link = screen.getByRole("link");
      expect(link).toBeTruthy();
      // Hardcoding the host is a bit risky but this should always be true in  test environment
      expect(link.href).toBe("http://localhost/" + slug);
    });

    it("does not render the keynote icon", () => {
      expect(container.querySelector("svg")).toBeFalsy();
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

    describe("for a keynote", () => {
      let container;
      const keynoteNode = {
        node: {
          frontmatter: { category: "fluffy-stuff", event: "VIPCon", keynote: true },
          fields
        }
      };

      beforeEach(() => {
        cleanup();
        const rendered = render(
          <EventList edges={[keynoteNode]} listener={listener} />
        );
        container = rendered.container;
      });

      it("renders the title", () => {
        expect(screen.getByText(title)).toBeTruthy();
      });

      it("renders the event name", () => {
        expect(screen.getByText("VIPCon")).toBeTruthy();
      });

      it("renders the keynote icon", () => {
        expect(container.querySelector("svg")).toBeTruthy();
      });

      it("renders the correct link", () => {
        const link = screen.getByRole("link");
        expect(link).toBeTruthy();
        // Hardcoding the host is a bit risky but this should always be true in  test environment
        expect(link.href).toBe("http://localhost/" + slug);
      });
    });
  });

  describe("when show date is set", () => {
    beforeEach(() => {
      listener = jest.fn();
      render(<EventList edges={edges} listener={listener} showDate={true} />);
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
