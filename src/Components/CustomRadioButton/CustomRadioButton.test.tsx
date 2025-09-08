import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import CustomRadioButton from "./CustomRadioButton";

describe("CustomRadioButton", () => {
  const customRadio = "custom-radio";
  const selectedColor = "primary.checkedRadioSelected";

  it("renders correctly", () => {
    render(<CustomRadioButton checked={false} onChange={() => {}} />);
    const radioButton = screen.getByTestId(customRadio);
    expect(radioButton).toBeInTheDocument();
  });

  it("calls onChange when clicked", () => {
    const handleChange = vi.fn();
    render(<CustomRadioButton checked={false} onChange={handleChange} />);
    fireEvent.click(screen.getByTestId(customRadio));
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it("displays check icon when checked", () => {
    render(<CustomRadioButton checked={true} onChange={() => {}} />);
    const checkIcon = screen.getByTestId("CheckIcon");
    expect(checkIcon).toBeInTheDocument();
  });

  it("does not display check icon when unchecked", () => {
    render(<CustomRadioButton checked={false} onChange={() => {}} />);
    const checkIcon = screen.queryByTestId("CheckIcon");
    expect(checkIcon).not.toBeInTheDocument();
  });

  it("applies correct styles when checked", () => {
    render(<CustomRadioButton checked={true} onChange={() => {}} />);
    const radioButton = screen.getByTestId(customRadio);
    expect(radioButton).toHaveStyle({ backgroundColor: selectedColor });
  });

  it("applies correct styles when unchecked", () => {
    render(<CustomRadioButton checked={false} onChange={() => {}} />);
    const radioButton = screen.getByTestId(customRadio);
    expect(radioButton).toHaveStyle({ backgroundColor: "background.paper" });
  });

  it("renders CustomRadioButton correctly when passed a size prop", () => {
    render(<CustomRadioButton checked={false} onChange={() => {}} size={30} />);
    const radioButton = screen.getByTestId(customRadio);

    expect(radioButton).toBeInTheDocument();
  });

  it("applies correct styles on hover when checked", async () => {
    render(<CustomRadioButton checked={true} onChange={() => {}} />);
    const radioButton = screen.getByTestId(customRadio);

    fireEvent.mouseOver(radioButton);
    expect(radioButton).toHaveStyle({ borderColor: selectedColor });
  });

  it("applies correct styles on hover when unchecked", async () => {
    render(<CustomRadioButton checked={false} onChange={() => {}} />);
    const radioButton = screen.getByTestId(customRadio);

    fireEvent.mouseOver(radioButton);
    expect(radioButton).toHaveStyle({ borderColor: selectedColor });
  });

  it("renders with custom class when provided", () => {
    render(
      <CustomRadioButton
        checked={false}
        onChange={() => {}}
        className="custom-class"
      />
    );
    const radioButton = screen.getByTestId(customRadio);
    expect(radioButton).toHaveClass("custom-class");
  });
});
