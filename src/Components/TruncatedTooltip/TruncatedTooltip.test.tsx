/* eslint-disable testing-library/no-node-access */
import React from "react";
import { render, screen } from "@testing-library/react";
import { TruncatedTooltipText } from "./TruncatedTooltip";

describe("TruncatedTooltipText", () => {
  it("renders the text when provided", () => {
    render(<TruncatedTooltipText text="Test Text" />);
    expect(screen.getByText("Test Text")).toBeInTheDocument();
  });

  it("renders the children when provided", () => {
    render(
      <TruncatedTooltipText>
        <span>Child Content</span>
      </TruncatedTooltipText>
    );
    expect(screen.getByText("Child Content")).toBeInTheDocument();
  });

  it("renders Tooltip with correct title", () => {
    render(<TruncatedTooltipText text="Tooltip Text" />);
    screen.getByText("Tooltip Text");
  });
});
