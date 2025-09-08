import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import { Provider } from "react-redux";
import { SnackbarProvider } from "notistack";
import { MemoryRouter } from "react-router-dom";
import BillingCyclesPage from "./BillingCyclesPage";
import { store } from "redux/store";
import * as tenantApiSlice from "redux/app/tenantManagementApiSlice";
import * as notistack from "notistack";
import * as permissionHook from "Hooks/usePermission";

vi.mock("./RenderButton", () => ({
  default: ({ handleCancel }: { handleCancel: () => void }) => (
    <button onClick={handleCancel}>Cancel</button>
  ),
}));

const mockData = {
  id: "1",
  cycleName: "Monthly",
  duration: 1,
  durationUnit: "MONTHLY",
  description: "Monthly billing cycle",
};

const renderBillingCyclesPage = () => {
  render(
    <Provider store={store}>
      <SnackbarProvider>
        <MemoryRouter>
          <BillingCyclesPage />
        </MemoryRouter>
      </SnackbarProvider>
    </Provider>
  );
};

describe("BillingCyclesPage", () => {
  const mockEnqueueSnackbar = vi.fn();
  const mockCreateBillingCycle = vi.fn().mockReturnValue({ unwrap: () => {} });
  const mockUpdateBillingCycle = vi.fn().mockReturnValue({ unwrap: () => {} });
  const mockDeleteBillingCycle = vi.fn().mockReturnValue({ unwrap: () => {} });

  beforeEach(() => {
    vi.clearAllMocks();

    vi.spyOn(tenantApiSlice, "useGetBillingCyclesQuery").mockReturnValue({
      data: [mockData],
      isLoading: false,
      refetch: vi.fn(),
    });

    vi.spyOn(tenantApiSlice, "useCreateBillingCyclesMutation").mockReturnValue([
      mockCreateBillingCycle,
      { isLoading: false, reset: vi.fn() },
    ]);

    vi.spyOn(tenantApiSlice, "useUpdateBillingCyclesMutation").mockReturnValue([
      mockUpdateBillingCycle,
      { isLoading: false, reset: vi.fn() },
    ]);

    vi.spyOn(tenantApiSlice, "useDeleteBillingCyclesMutation").mockReturnValue([
      mockDeleteBillingCycle,
      { isLoading: false, reset: vi.fn() },
    ]);

    vi.spyOn(notistack, "useSnackbar").mockReturnValue({
      enqueueSnackbar: mockEnqueueSnackbar,
      closeSnackbar: vi.fn(),
    });
    vi.spyOn(permissionHook, "usePermission").mockReturnValue(true);
  });

  it("renders the page header", () => {
    renderBillingCyclesPage();
    expect(screen.getByText("Billing Cycles")).toBeInTheDocument();
  });

  it("renders the form and buttons", () => {
    renderBillingCyclesPage();
    expect(screen.getByTestId("billing-cycles-page")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
    expect(screen.getByText("Submit")).toBeInTheDocument();
  });

  it("displays loading state when data is loading", () => {
    vi.spyOn(tenantApiSlice, "useGetBillingCyclesQuery").mockReturnValue({
      data: null,
      isLoading: true,
      refetch: vi.fn(),
    });

    renderBillingCyclesPage();
    expect(screen.getByTestId("page-loader")).toBeInTheDocument();
  });

  it("renders billing cycle data in the form when a billing cycle is selected", async () => {
    renderBillingCyclesPage();

    const autocompleteInput = screen.getByRole("combobox");
    fireEvent.change(autocompleteInput, {
      target: { value: mockData.cycleName },
    });
    const option = await screen.findByText(mockData.cycleName);
    fireEvent.click(option);

    await waitFor(() => {
      expect(
        screen.getByDisplayValue(mockData.duration.toString())
      ).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(
        screen.getByDisplayValue(mockData.description)
      ).toBeInTheDocument();
    });
  });

  it("submits the form with valid data", async () => {
    renderBillingCyclesPage();
    const autocompleteInput = screen.getByRole("combobox");
    fireEvent.change(autocompleteInput, {
      target: { value: mockData.cycleName },
    });
    const option = await screen.findByText(mockData.cycleName);
    fireEvent.click(option);

    const submitButton = screen.getByText("Submit");

    await waitFor(() => {
      expect(submitButton).toBeEnabled();
    });
    await waitFor(() => {
      expect(
        screen.queryByText("Duration is required")
      ).not.toBeInTheDocument();
    });
    await waitFor(() => {
      expect(
        screen.queryByText("Description is required")
      ).not.toBeInTheDocument();
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockUpdateBillingCycle).toHaveBeenCalledWith(mockData);
    });
    await waitFor(() => {
      expect(mockEnqueueSnackbar).toHaveBeenCalledWith(
        "Billing Cycle Updated Successfully",
        { variant: "success" }
      );
    });
  });
});
