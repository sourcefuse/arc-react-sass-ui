import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import CustomPieChart from "./CustomPieChart";

describe("CustomPieChart", () => {
  const data = [
    { color: "#8884d8", name: "Group A", value: 400 },
    { color: "#82ca9d", name: "Group B", value: 300 },
    { color: "#ffc658", name: "Group C", value: 300 },
  ];

  it("renders without crashing", () => {
    const { container } = render(<CustomPieChart data={data} />);
    expect(container).toBeInTheDocument();
  });

  it("renders the legend with correct values", () => {
    render(<CustomPieChart data={data} />);
    data.forEach((entry) => {
      const legendName = screen.getByText(entry.name);
      expect(legendName).toBeInTheDocument();
    });
  });
});
