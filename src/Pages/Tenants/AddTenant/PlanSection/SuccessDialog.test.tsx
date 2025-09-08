import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import SuccessDialog from "./SuccessDialog";
import { vi } from "vitest";

describe("SuccessDialog Component", () => {
  const mockOnClose = vi.fn();

  const renderComponent = (isOpen: boolean) => {
    return render(
      <BrowserRouter>
        <SuccessDialog isDialogOpen={isOpen} onNavigateToTenant={mockOnClose} />
      </BrowserRouter>
    );
  };

  test("renders the dialog when open", () => {
    renderComponent(true);

    expect(screen.getByText("Success")).toBeInTheDocument();
    expect(
      screen.getByText(
        "The process to add tenant has been initiated successfully."
      )
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Add more tenants/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Go to Tenants/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Go to Dashboard/i })
    ).toBeInTheDocument();
  });

  test("does not render when closed", () => {
    renderComponent(false);
    expect(screen.queryByText("Success")).not.toBeInTheDocument();
  });

  test('calls onClose when "Add more tenants" is clicked', async () => {
    renderComponent(true);
    const button = screen.getByRole("button", { name: /Add more tenants/i });
    await userEvent.click(button);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('navigates when "Go to Tenants" is clicked', async () => {
    renderComponent(true);
    const button = screen.getByRole("button", { name: /Go to Tenants/i });

    await userEvent.click(button);
    expect(window.location.pathname).toBe("/tenants"); // Mocking navigation
  });

  test('navigates when "Go to Dashboard" is clicked', async () => {
    renderComponent(true);
    const button = screen.getByRole("button", { name: /Go to Dashboard/i });

    await userEvent.click(button);
    expect(window.location.pathname).toBe("/dashboard"); // Mocking navigation
  });
});
