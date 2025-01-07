import React from "react";
import { render, screen } from "@testing-library/react";
import { Author } from "./Author";


describe("Author", () => {
  describe("with a note", () => {
    const note = "stuff";

    beforeEach(() => {
      render(
        <Author
          note={note}
          data={{ file: "file://something" }}
        />
      );
    });

    it("renders the note", () => {
      expect(screen.getByText(note)).toBeTruthy();
    });

  });
});
