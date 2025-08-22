import { fireEvent, render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { CloseButton } from "./CloseButton";

describe("CloseButton", () => {
  it("renders correctly", () => {
    render(<CloseButton />);
    expect(screen.getByTestId("close-btn")).toBeInTheDocument();
  });

  it("calls onClick when clicked", () => {
    const onClickMock = vi.fn();

    render(<CloseButton onClick={onClickMock} />);
    const button = screen.getByTestId("close-btn");

    fireEvent.click(button);
    expect(onClickMock).toHaveBeenCalledTimes(1);
  });

  it("does not trigger onClick when disabled", () => {
    const onClickMock = vi.fn();

    render(<CloseButton onClick={onClickMock} disabled />);
    const button = screen.getByTestId("close-btn");

    fireEvent.click(button);
    expect(onClickMock).not.toHaveBeenCalled();
  });
});
