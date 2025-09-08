import { render, screen } from "@testing-library/react";
import StatusChipSection from "./StatusChipSection";
import { describe, it, expect } from "vitest";

const title = "Test Title";
describe("StatusChipSection", () => {
  it("renders the title correctly", () => {
    const data = ["Chip1", "Chip2"];

    render(<StatusChipSection title={title} data={data} />);

    expect(screen.getByText(title)).toBeInTheDocument();
  });

  it("renders the correct number of StatusChip components", () => {
    const data = ["Chip1", "Chip2", "Chip3"];

    render(<StatusChipSection title={title} data={data} />);

    const chips = screen.getAllByText(/Chip/);
    expect(chips).toHaveLength(data.length);
  });

  it("renders StatusChip components with correct labels", () => {
    const data = ["Chip1", "Chip2"];

    render(<StatusChipSection title={title} data={data} />);

    data.forEach((chipLabel) => {
      expect(screen.getByText(chipLabel)).toBeInTheDocument();
    });
  });
});
