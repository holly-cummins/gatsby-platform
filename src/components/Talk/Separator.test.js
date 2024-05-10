import React from "react";
import { render } from "@testing-library/react";
import Separator from "./Separator";

import theme from "../../theme/theme.yaml";

describe("A visual separator", () => {
  beforeEach(() => {
    render(<Separator theme={theme} />);
  });

  // Dummy test to force rendering
  // eslint-disable-next-line jest/expect-expect
  it("renders something", () => {});
});
