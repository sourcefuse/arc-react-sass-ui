import { screen, fireEvent, waitFor } from "@testing-library/react";
import CreatePlanItem from "./CreatePlanItem";
import { SnackbarProvider } from "notistack";
import { describe, it, beforeEach, expect, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import * as planItemsApiSlice from "redux/app/planItemsApiSlice";
import * as featuresApiSlice from "redux/app/featuresApiSlice";
import * as authApiSlice from "redux/auth/authApiSlice";
import * as notistack from "notistack";
import { renderWithStore } from "Tests/utils/renderWithStore";

describe("Create Plan Item", () => {
  const mockEnqueueSnackbar = vi.fn();
  const mockCreatePlanItem = vi.fn().mockReturnValue({ unwrap: () => {} });

  beforeEach(() => {
    vi.clearAllMocks();

    // Spy on useCreatePlanItemsMutation
    vi.spyOn(planItemsApiSlice, "useCreatePlanItemsMutation").mockReturnValue([
      mockCreatePlanItem,
      { isLoading: false, reset: vi.fn() },
    ]);

    // Spy on useGetFeaturesQuery
    vi.spyOn(featuresApiSlice, "useGetFeaturesQuery").mockReturnValue({
      data: [
        { id: "1", name: "Feature 1" },
        { id: "2", name: "Feature 2" },
      ],
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    });

    vi.spyOn(authApiSlice, "useGetUserQuery").mockReturnValue({
      data: { id: "user123" },
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    });

    // Spy on useSnackbar
    vi.spyOn(notistack, "useSnackbar").mockReturnValue({
      enqueueSnackbar: mockEnqueueSnackbar,
      closeSnackbar: vi.fn(),
    });
  });

  const renderCreatePlanItem = () => {
    return renderWithStore(
      <MemoryRouter>
        <SnackbarProvider>
          <CreatePlanItem />
        </SnackbarProvider>
      </MemoryRouter>
    );
  };

  const fillFormWithValidData = async () => {
    // Fill plan name
    fireEvent.change(screen.getByLabelText(/Plan Item Name/i), {
      target: { value: "Test Plan" },
    });

    // Fill description
    fireEvent.change(screen.getByLabelText(/Description/i), {
      target: { value: "Test Description" },
    });

    // Select feature
    const featureSelect = screen.getByLabelText(/Feature/i);
    fireEvent.mouseDown(featureSelect);
    const options = await screen.findAllByRole("option");
    fireEvent.click(options[0]);
  };

  it("renders the form with all required fields", () => {
    renderCreatePlanItem();

    expect(screen.getByLabelText(/Plan Item Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Feature/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Submit/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /Cancel/i })).toBeInTheDocument();
  });

  it("shows validation errors when form fields are touched and left empty", async () => {
    renderCreatePlanItem();

    const requiredFields = [
      { label: /Plan Item name/i, errorMessage: "Plane name is required" },
      { label: /Description/i, errorMessage: "Description is required" },
      { label: /Feature/i, errorMessage: "Feature is required" },
    ];

    for (const field of requiredFields) {
      const input = screen.getByLabelText(field.label);
      await userEvent.click(input);
      await userEvent.tab();
    }

    await waitFor(() => {
      requiredFields.forEach((field) => {
        expect(screen.getByText(field.errorMessage)).toBeInTheDocument();
      });

      const submitButton = screen.getByRole("button", { name: /Submit/i });
      expect(submitButton).toBeDisabled();
    });
  });

  it("successfully submits form with valid data", async () => {
    renderCreatePlanItem();

    await fillFormWithValidData();

    const submitButton = screen.getByRole("button", {
      name: /Submit/i,
      hidden: true,
    });
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(mockCreatePlanItem).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "Test Plan",
          description: "Test Description",
          planValue: { features: ["Feature 1"] },
        })
      );
    });
    expect(mockEnqueueSnackbar).toHaveBeenCalledWith(
      "Plan Item Created Successfully",
      { variant: "success" }
    );
  });
});
