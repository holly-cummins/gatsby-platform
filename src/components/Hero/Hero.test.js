import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Hero from ".";

describe("Hero", () => {
  const scrollFn = jest.fn(() => {
  });

  beforeEach(async () => {
    render(<Hero backgrounds={{}} scrollToContent={scrollFn} />);
  });

  it("renders the scroll button", async () => {
    expect(screen.getByLabelText("scroll")).toBeTruthy();
  });

  it("the scroll button calls the scroll function", () => {
    fireEvent.click(screen.getByLabelText("scroll"));
    expect(scrollFn).toHaveBeenCalledTimes(1);
  });
});
