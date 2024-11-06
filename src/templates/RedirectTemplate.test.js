import React from "react";
import { render } from "@testing-library/react";

import theme from "../theme/theme.yaml";
import RedirectTemplate from "./RedirectTemplate";
import Helmet from "react-helmet";

describe("RedirectTemplate", () => {
  const node = {
    url: "http://nice-place.com"
  };

  beforeEach(() => {
    render(<RedirectTemplate pageContext={{ node }} />);
  });

  it("should render correct meta data for the front page", () => {
    const helmet = Helmet.peek();

    expect(helmet.metaTags).toContainEqual(
      expect.objectContaining({
        "http-equiv": "refresh"
      })
    );
  });
});
