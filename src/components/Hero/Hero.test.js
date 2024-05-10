import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Hero from ".";

import themeObjectFromYaml from "../../theme/theme.yaml";

describe("Hero", () => {
  const scrollFn = jest.fn(() => {});

  beforeEach(async () => {
    render(<Hero theme={themeObjectFromYaml} backgrounds={{}} scrollToContent={scrollFn} />);
  });

  it("renders the scroll button", async () => {
    expect(screen.getByLabelText("scroll")).toBeTruthy();
  });

  it("the scroll button calls the scroll function", () => {
    fireEvent.click(screen.getByLabelText("scroll"));
    expect(scrollFn).toHaveBeenCalledTimes(1);
  });
});
