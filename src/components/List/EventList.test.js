import React from "react";
import { render, screen } from "@testing-library/react";

import EventList from "./EventList";

import theme from "../../theme/theme.yaml";

describe("EventList", () => {
  describe("for an internal post", () => {
    const title = "some post";
    const slug = "sluggaroo";
    const node = {
      node: {
        frontmatter: { category: "test-stuff", title, event: "QuackCon" },
        fields: { source: "some-source", slug }
      }
    };
    const edges = [node];

    beforeEach(() => {
      render(<EventList edges={edges} theme={theme} />);
    });

    it("renders the title", () => {
      expect(screen.getByText(title)).toBeTruthy();
    });

    it("renders the event name", () => {
      expect(screen.getByText("QuackCon")).toBeTruthy();
    });

    it("renders the correct link", () => {
      const link = screen.getByRole("link");
      expect(link).toBeTruthy();
      // Hardcoding the host is a bit risky but this should always be true in  test environment
      expect(link.href).toBe("http://localhost/" + slug);
    });
  });
});
