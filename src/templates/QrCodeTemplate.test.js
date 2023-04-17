import React from "react";
import { render, screen } from "@testing-library/react";

import QrCodeTemplate from "./QrCodeTemplate";

import { ThemeContext } from "../layouts";

import themeObjectFromYaml from "../theme/theme.yaml";

// Mock out things with static queries
// eslint-disable-next-line react/display-name
jest.mock("../components/Post/Author.js", () => () => <></>);

// @see https://testing-library.com/docs/react-testing-library/setup#custom-render
const renderWithTheme = ui => {
  return render(<ThemeContext.Provider value={themeObjectFromYaml}>{ui}</ThemeContext.Provider>);
};

describe("QR Code Template", () => {
  const slug = "/sluggeroo";

  const postQuery = {
    slug
  };

  // Why is this each? See https://stackoverflow.com/questions/67669213/react-testing-library-using-beforeall-to-render-cannot-find-item-on-2nd-test
  beforeEach(() => {
    renderWithTheme(<QrCodeTemplate pageContext={postQuery} />);
  });

  it("renders the target URL", () => {
    expect(screen.getByText("http://gatsby-platform.hollycummins.com/sluggeroo")).toBeTruthy();
  });

  it("renders the QR code", () => {
    // The QR code gets rendered as an svg
    expect(screen.getByRole("img")).toBeTruthy();
  });
});
