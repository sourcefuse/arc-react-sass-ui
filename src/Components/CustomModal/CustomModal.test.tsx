import { fireEvent, render, screen } from "@testing-library/react";
import { vi } from "vitest";
import CustomModal from "./CustomModal";

describe("CustomModal", () => {
  it("renders children when open", () => {
    render(
      <CustomModal open={true} handleClose={vi.fn()}>
        <p data-testid="modal-content">Modal Content</p>
      </CustomModal>
    );

    expect(screen.getByTestId("modal-content")).toBeInTheDocument();
  });

  it("does not render when closed", () => {
    render(
      <CustomModal open={false} handleClose={vi.fn()}>
        <p data-testid="modal-content">Modal Content</p>
      </CustomModal>
    );

    expect(screen.queryByTestId("modal-content")).not.toBeInTheDocument();
  });

  it("calls handleClose when the modal is closed", () => {
    const handleClose = vi.fn();

    render(
      <CustomModal open={true} handleClose={handleClose}>
        <div>Modal Content</div>
      </CustomModal>
    );

    // Simulate closing the modal by pressing the Escape key
    fireEvent.keyDown(screen.getByRole("presentation"), {
      key: "Escape",
      code: "Escape",
    });
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("applies custom modalWidth and padding", () => {
    render(
      <CustomModal open={true} modalWidth={500} padding={3}>
        <div>Modal Content</div>
      </CustomModal>
    );

    // Check if the modal has the correct width and padding
    // eslint-disable-next-line testing-library/no-node-access
    const modalBox = screen.getByText("Modal Content").parentElement;
    expect(modalBox).toHaveStyle("width: 500px");
    expect(modalBox).toHaveStyle("padding: 24px"); // MUI uses 8px as base, so 3 * 8 = 24px
  });

  it("renders with default props when no custom props are provided", () => {
    render(
      <CustomModal open={true}>
        <div>Modal Content</div>
      </CustomModal>
    );

    // Check if the modal has default width and padding
    // eslint-disable-next-line testing-library/no-node-access
    const modalBox = screen.getByText("Modal Content").parentElement;
    expect(modalBox).toHaveStyle("width: 400px");
    expect(modalBox).toHaveStyle("padding: 16px"); // Default padding (2 * 8 = 16px)
  });
});
