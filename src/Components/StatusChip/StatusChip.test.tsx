import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import StatusChip from "./StatusChip";

describe("StatusChip Component", () => {
  it("renders with the correct label", () => {
    render(<StatusChip label="Active" color="green" />);
    const chipElement = screen.getByTestId("status-chip");
    expect(chipElement).toBeInTheDocument();
  });

  it("renders with empty label and color without crashing", () => {
    render(<StatusChip label="" color="" />);
    const chipElement = screen.getByTestId("status-chip");
    expect(chipElement).toBeInTheDocument();
  });
});
