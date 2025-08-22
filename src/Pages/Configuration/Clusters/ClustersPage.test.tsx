import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import { Provider } from "react-redux";
import { SnackbarProvider } from "notistack";
import { MemoryRouter } from "react-router-dom";
import ClustersPage from "./ClustersPage";
import { store } from "redux/store";
import * as tenantApiSlice from "redux/app/tenantManagementApiSlice";
import * as notistack from "notistack";
import * as permissionHook from "Hooks/usePermission";

vi.mock("Pages/Configuration/Clusters/RenderButton", () => ({
  default: ({ handleCancel }: { handleCancel: () => void }) => (
    <button onClick={handleCancel}>Cancel</button>
  ),
}));
const mockData = {
  id: "1",
  region: "us-east-1",
  zone: "zone-a",
  description: "Test Cluster",
  clusterTypeId: "type-1",
  label: "Cluster Type 1",
  clusterTypeDescription: "Description for Cluster Type 1",
};
// Helper to render the component
const renderClustersPage = () => {
  render(
    <Provider store={store}>
      <SnackbarProvider>
        <MemoryRouter>
          <ClustersPage />
        </MemoryRouter>
      </SnackbarProvider>
    </Provider>
  );
};

describe("ClustersPage", () => {
  const mockEnqueueSnackbar = vi.fn();
  const mockCreateCluster = vi.fn().mockReturnValue({ unwrap: () => {} });
  const mockUpdateCluster = vi.fn().mockReturnValue({ unwrap: () => {} });
  const mockDeleteCluster = vi.fn().mockReturnValue({ unwrap: () => {} });

  beforeEach(() => {
    vi.clearAllMocks();

    vi.spyOn(tenantApiSlice, "useGetClusterWithTypeQuery").mockReturnValue({
      data: [mockData],
      isLoading: false,
      refetch: vi.fn(),
    });

    vi.spyOn(tenantApiSlice, "useCreateClustersMutation").mockReturnValue([
      mockCreateCluster,
      { isLoading: false, reset: vi.fn() },
    ]);

    vi.spyOn(tenantApiSlice, "useUpdateClustersMutation").mockReturnValue([
      mockUpdateCluster,
      { isLoading: false, reset: vi.fn() },
    ]);

    vi.spyOn(tenantApiSlice, "useDeleteClusterMutation").mockReturnValue([
      mockDeleteCluster,
      { isLoading: false, reset: vi.fn() },
    ]);

    vi.spyOn(notistack, "useSnackbar").mockReturnValue({
      enqueueSnackbar: mockEnqueueSnackbar,
      closeSnackbar: vi.fn(),
    });
    vi.spyOn(permissionHook, "usePermission").mockReturnValue(true);
  });

  it("renders the page header", () => {
    renderClustersPage();
    expect(screen.getByText("Clusters")).toBeInTheDocument();
  });

  it("renders the form and buttons", () => {
    renderClustersPage();
    expect(screen.getByTestId("clusters-page")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
    expect(screen.getByText("Submit")).toBeInTheDocument();
  });

  it("calls handleCancel when Cancel button is clicked", () => {
    renderClustersPage();
    fireEvent.click(screen.getByText("Cancel"));
    expect(window.location.pathname).toBe("/"); // Mocking navigation
  });

  it("displays loading state when data is loading", () => {
    vi.spyOn(tenantApiSlice, "useGetClusterWithTypeQuery").mockReturnValue({
      data: null,
      isLoading: true,
      refetch: vi.fn(),
    });

    renderClustersPage();
    expect(screen.getByTestId("page-loader")).toBeInTheDocument();
  });

  it("renders cluster data in the form when a cluster is selected", async () => {
    renderClustersPage();

    const autocompleteInput = screen.getByRole("combobox");
    fireEvent.change(autocompleteInput, { target: { value: mockData.label } });
    const option = await screen.findByText(mockData.label);
    fireEvent.click(option);

    await waitFor(() => {
      expect(screen.getByDisplayValue("us-east-1")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByDisplayValue("zone-a")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByDisplayValue("Test Cluster")).toBeInTheDocument();
    });
  });

  it("submits the form with valid data", async () => {
    renderClustersPage();

    const autocompleteInput = screen.getByRole("combobox");
    fireEvent.change(autocompleteInput, { target: { value: mockData.label } });

    const option = await screen.findByText(mockData.label);
    fireEvent.click(option);

    const submitButton = screen.getByTestId("submit-button");
    await waitFor(() => {
      expect(submitButton).toBeEnabled();
    });
    await waitFor(() => {
      expect(screen.queryByText("Region is required")).not.toBeInTheDocument();
    });
    await waitFor(() => {
      expect(
        screen.queryByText("Description is required")
      ).not.toBeInTheDocument();
    });
    await waitFor(() => {
      expect(
        screen.queryByText("Cluster Type Description is required")
      ).not.toBeInTheDocument();
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockUpdateCluster).toHaveBeenCalledWith(mockData);
    });
    await waitFor(() => {
      expect(mockEnqueueSnackbar).toHaveBeenCalledWith(
        "Cluster Updated Successfully",
        { variant: "success" }
      );
    });
  });
});
