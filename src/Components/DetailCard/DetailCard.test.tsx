/* eslint-disable testing-library/no-node-access */
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import DetailCard from "./DetailCard";

describe("DetailCard Component", () => {
  const mockIcon = <span data-testid="mock-icon">Icon</span>;
  const mockLabel = "Test Label";
  const mockValue = "Test Value";

  it("renders the icon, label, and value correctly", () => {
    render(<DetailCard icon={mockIcon} label={mockLabel} value={mockValue} />);

    // Check if the icon, label, and value are rendered
    expect(screen.getByTestId("mock-icon")).toBeInTheDocument();
    expect(screen.getByText(mockLabel)).toBeInTheDocument();
    expect(screen.getByText(mockValue)).toBeInTheDocument();
  });
});
