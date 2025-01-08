import React from "react";
import { render, screen } from "@testing-library/react";
import ContactPage from "./contact";

import config from "../utils/configger";

const layoutData = {
  bgDesktop: {
    resize: { src: "desktop" }
  },
  bgTablet: {
    resize: { src: "tablet" }
  },
  bgMobile: {
    resize: { src: "mobile" }
  }
};

describe("ContactPage", () => {
  beforeEach(async () => {
    render(<ContactPage />);
  });
  it("renders without error and includes some social links", async () => {
    expect(screen.getByText("@" + config.authorTwitterAccount)).toBeTruthy();
  });

  it("includes multiple social links", async () => {
    expect(screen.getAllByRole("link").length).toBeGreaterThanOrEqual(5); // This is a bit coupled to our content, but it's easy enough to maintain
  });
});
