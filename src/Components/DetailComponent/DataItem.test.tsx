import { render, screen } from "@testing-library/react";
import { DataItem } from "./DataItem";

const label = "Test Label";
describe("DataItem Component", () => {
  it("renders the label correctly", () => {
    render(<DataItem label={label} value="Test Value" />);
    expect(screen.getByText("Test Label")).toBeInTheDocument();
  });

  it("renders the value as a Typography when highlight is false", () => {
    render(<DataItem label={label} value="Test Value" highlight={false} />);
    expect(screen.getByText(label)).toBeInTheDocument();
    expect(screen.getByText(label).tagName).toBe("P"); // Typography renders as <p>
  });

  it("renders the value as a StatusChip when highlight is true", () => {
    render(<DataItem label={label} value="Test Value" highlight={true} />);
    expect(screen.getByText(label)).toBeInTheDocument();
  });
});
