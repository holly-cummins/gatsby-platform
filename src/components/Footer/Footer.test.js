import React from "react";
import renderer from "react-test-renderer";
import Footer from ".";

import themeObjectFromYaml from "../../theme/theme.yaml";

describe("Footer", () => {
  it("renders correctly", () => {
    const tree = renderer.create(<Footer html="" theme={themeObjectFromYaml} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
