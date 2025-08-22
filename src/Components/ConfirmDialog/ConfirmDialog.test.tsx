import { render, screen, fireEvent } from "@testing-library/react";
import ConfirmDialog from "./ConfirmDialog";
import { vi } from "vitest";

describe("ConfirmDialog Component", () => {
  const onClose = vi.fn();
  const onConfirm = vi.fn();
  const title = "Confirm Action";
  const description = "Are you sure you want to proceed?";

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders the dialog when open is true", () => {
    render(
      <ConfirmDialog
        open={true}
        onClose={onClose}
        onConfirm={onConfirm}
        title={title}
        description={description}
      />
    );

    expect(screen.getByText(title)).toBeInTheDocument();
    expect(screen.getByText(description)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /confirm/i })
    ).toBeInTheDocument();
  });

  it("does not render the dialog when open is false", () => {
    render(
      <ConfirmDialog
        open={false}
        onClose={onClose}
        onConfirm={onConfirm}
        title={title}
        description={description}
      />
    );

    expect(screen.queryByText(title)).not.toBeInTheDocument();
    expect(screen.queryByText(description)).not.toBeInTheDocument();
  });

  it("calls onClose when the Cancel button is clicked", () => {
    render(
      <ConfirmDialog
        open={true}
        onClose={onClose}
        onConfirm={onConfirm}
        title={title}
        description={description}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onConfirm when the Confirm button is clicked", () => {
    render(
      <ConfirmDialog
        open={true}
        onClose={onClose}
        onConfirm={onConfirm}
        title={title}
        description={description}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /confirm/i }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });
});
