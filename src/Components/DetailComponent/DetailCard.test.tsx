import { render, screen } from "@testing-library/react";
import DetailCard from "./DetailCard";
import { vi } from "vitest";

describe("DetailCard Component", () => {
  const mockHandleClose = vi.fn();

  const mockProps = {
    title: "Test Title",
    sections: [
      {
        title: "Section 1",
        data: [
          { label: "Label 1", value: "Value 1" },
          { label: "Label 2", value: 123 },
        ],
      },
      {
        title: "Section 2",
        data: [
          { label: "Label 3", value: "Value 3" },
          { label: "Label 4", value: 456 },
        ],
      },
    ],
    actions: <button>Action Button</button>,
    extraContent: <div>Extra Content</div>,
    handleClose: mockHandleClose,
  };

  it("renders the title correctly", () => {
    render(<DetailCard {...mockProps} />);
    expect(screen.getByText("Test Title")).toBeInTheDocument();
  });

  it("renders all sections and their data", () => {
    render(<DetailCard {...mockProps} />);
    expect(screen.getByText("Section 1")).toBeInTheDocument();
    expect(screen.getByText("Label 1")).toBeInTheDocument();
    expect(screen.getByText("Value 1")).toBeInTheDocument();
    expect(screen.getByText("Label 2")).toBeInTheDocument();
    expect(screen.getByText("123")).toBeInTheDocument();

    expect(screen.getByText("Section 2")).toBeInTheDocument();
    expect(screen.getByText("Label 3")).toBeInTheDocument();
    expect(screen.getByText("Value 3")).toBeInTheDocument();
    expect(screen.getByText("Label 4")).toBeInTheDocument();
    expect(screen.getByText("456")).toBeInTheDocument();
  });

  it("renders actions and extra content", () => {
    render(<DetailCard {...mockProps} />);
    expect(screen.getByText("Action Button")).toBeInTheDocument();
    expect(screen.getByText("Extra Content")).toBeInTheDocument();
  });
});
