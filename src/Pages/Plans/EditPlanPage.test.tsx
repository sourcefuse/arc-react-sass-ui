import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import EditPlanPage from "./EditPlan";
import { vi } from "vitest";
import { Provider } from "react-redux";
import { store } from "../../redux/store";
import * as tenantApiSlice from "redux/app/tenantManagementApiSlice";
import * as notistack from "notistack";
import * as configurationApiSlice from "redux/app/planItemsApiSlice";
import * as plansApiSlice from "redux/app/plansApiSlice";

const mockPlanItems = [
  {
    id: "Plan1",
    name: "Basic Plan",
    description: "Basic features plan",
    createdOn: "2024-01-01",
    modifiedOn: "2024-01-02",
  },
];

const mockResponse = {
  id: "some-id",
  name: "Vodafone",
  isCustomPlan: true,
  billingCycleId: "Sub 1",
  amount: 9999,
  clusterId: "Cluster 1",
  planPlanItem: [
    {
      planItem: { name: "Basic Plan" },
      planItemId: "Plan1",
    },
  ],
  tier: [{ id: "Tier 1" }],
  planTags: [{ tag: { id: "Tag 1" } }],
};

vi.mock("Pages/Configuration/PlanItems/RenderButton", () => ({
  default: ({ handleCancel }: { handleCancel: () => void }) => (
    <button onClick={handleCancel}>Cancel</button>
  ),
}));

describe("EditPlanPage", () => {
  const mockEnqueueSnackbar = vi.fn();
  const mockGetPlanItems = vi.fn();
  const mockGetPlanById = vi.fn();
  const mockGetPlanItemsCount = vi.fn();
  const mockUpdatePlan = vi.fn().mockReturnValue({ unwrap: () => {} });

  const renderComponent = () => {
    return render(
      <Provider store={store}>
        <MemoryRouter>
          <EditPlanPage />
        </MemoryRouter>
      </Provider>
    );
  };
  beforeEach(async () => {
    vi.clearAllMocks();

    vi.spyOn(plansApiSlice, "useLazyGetPlanByIdQuery").mockReturnValue([
      mockGetPlanById,
      { data: mockResponse, isLoading: false, reset: vi.fn() },
      { lastArg: { id: "", filter: {} } },
    ]);
    vi.spyOn(plansApiSlice, "useUpdatePlanAsCustomMutation").mockReturnValue([
      mockUpdatePlan,
      { isLoading: false, reset: vi.fn() },
    ]);
    vi.spyOn(configurationApiSlice, "useLazyGetPlanItemsQuery").mockReturnValue(
      [
        mockGetPlanItems,
        { data: mockPlanItems, isLoading: false, isError: false },
        { lastArg: {} },
      ]
    );
    vi.spyOn(
      configurationApiSlice,
      "useLazyGetPlanItemsCountQuery"
    ).mockReturnValue([
      mockGetPlanItemsCount,
      { data: { count: mockPlanItems?.length ?? 0 } },
      { lastArg: {} },
    ]);
    vi.spyOn(tenantApiSlice, "useGetTiersQuery").mockReturnValue({
      data: [
        { label: "Tier 1", value: "Tier 1" },
        { label: "Tier 2", value: "Tier 2" },
      ],
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    });
    vi.spyOn(tenantApiSlice, "useGetClustersSelectQuery").mockReturnValue({
      data: [
        { label: "Cluster 1", value: "Cluster 1" },
        { label: "Cluster 2", value: "Cluster 2" },
      ],
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    });
    vi.spyOn(tenantApiSlice, "useGetBillingCyclesQuery").mockReturnValue({
      data: [
        { label: "Sub 1", value: "Sub 1" },
        { label: "Subscription 2", value: "Subscription 2" },
      ],
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    });
    vi.spyOn(tenantApiSlice, "useGetTagsQuery").mockReturnValue({
      data: [
        { label: "Tag 1", value: "Tag 1" },
        { label: "Tag 2", value: "Tag 2" },
      ],
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    });
    vi.spyOn(notistack, "useSnackbar").mockReturnValue({
      enqueueSnackbar: mockEnqueueSnackbar,
      closeSnackbar: vi.fn(),
    });
  });
  it("renders the EditPlanPage component correctly", () => {
    renderComponent();

    expect(screen.getByTestId("edit-plan")).toBeInTheDocument();
  });
  it("renders the form with all required fields", () => {
    renderComponent();

    expect(screen.getByLabelText(/Plan Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Price/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Subscription Type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Cluster/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Tier/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Tag/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Submit/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /Cancel/i })).toBeInTheDocument();
  });
  it("submits the form successfully", async () => {
    renderComponent();
    await fillFormWithValidData();
    const submitButton = await screen.findByText("Submit");
    await waitFor(() => expect(submitButton).toBeEnabled());
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(mockEnqueueSnackbar).toHaveBeenCalledWith(
        "Plan Updated Successfully",
        { variant: "success" }
      );
    });
  });
  const fillFormWithValidData = async () => {
    // Toggle custom plan
    const isCustomCheckbox = screen.getByLabelText("Custom Plan");
    fireEvent.click(isCustomCheckbox);
  };
});
