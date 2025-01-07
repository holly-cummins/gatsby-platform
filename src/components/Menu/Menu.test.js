import React from "react";
import { render, screen } from "@testing-library/react";

import Menu from "./Menu";

describe("Menu", () => {
  const fixed = true;
  const path = "homepage";
  const width = 10;
  const loaded = true;
  const pages = [];

  beforeEach(() => {
    render(
      <Menu
        path={path}
        fixed={fixed}
        screenWidth={width}
        fontLoaded={loaded}
        pages={pages}

        searchAvailable={true}
      />
    );
  });

  it("includes a search item", () => {
    expect(screen.queryByText("Search")).toBeTruthy();
  });
});
