import React from "react";
import { render } from "@testing-library/react";
import Separator from "./Separator";

describe("A visual separator", () => {
  beforeEach(() => {
    render(<Separator />);
  });

  // Dummy test to force rendering
  // eslint-disable-next-line jest/expect-expect
  it("renders something", () => {
  });
});
