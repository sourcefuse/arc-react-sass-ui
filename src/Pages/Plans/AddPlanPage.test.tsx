import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AddPlanPage from "./AddPlanPage";
import { vi } from "vitest";
import { Provider } from "react-redux";
import { store } from "../../redux/store";
import * as tenantApiSlice from "redux/app/tenantManagementApiSlice";
import * as notistack from "notistack";
import * as configurationApiSlice from "redux/app/configurationApiSlice";
import userEvent from "@testing-library/user-event";

const mockPlanItems = [
  {
    id: "Plan Item 1",
    name: "Basic Plan",
    description: "Basic features plan",
    createdOn: "2024-01-01",
    modifiedOn: "2024-01-02",
  },
];
const mockCurrency = [
  {
    id: "23ae5dc6-b310-3a2b-e76c-3392a196d3aa",
    currencyCode: "USD",
    currencyName: "SourceFuse",
    symbol: null,
    country: "India",
  },
  {
    id: "ac47634a-6133-05ff-d538-db6ed26fd451",
    currencyCode: "INR",
    currencyName: "SourceFuse",
    symbol: null,
    country: "India",
  },
];
const saveCloseBtn = "Save & Close";
const mockData = {
  amount: 9999,
  billingCycleId: expect.any(String),
  clusterId: expect.any(String),
  currencyId: expect.any(String),
  isCustomPlan: expect.any(Boolean),
  name: "Test Plan",
  planItemIds: expect.any(Array),
  planTagIds: expect.any(Array),
  tierId: expect.any(String),
};

const dropDownFields = [
  { label: "Subscription Type" },
  { label: "Cluster" },
  { label: "Tier" },
  { label: "Tag" },
];

vi.mock("Pages/Configuration/PlanItems/RenderButton", () => ({
  default: ({ handleCancel }: { handleCancel: () => void }) => (
    <button onClick={handleCancel}>Cancel</button>
  ),
}));

describe("AddPlanPage", () => {
  const mockEnqueueSnackbar = vi.fn();
  const mockGetPlanItems = vi.fn();
  const mockGetPlanItemsCount = vi.fn();
  const mockCreatePlan = vi.fn().mockReturnValue({ unwrap: () => {} });
  const mockGetCurrencyData = vi
    .fn()
    .mockReturnValue({ unwrap: () => Promise.resolve(mockCurrency) });

  const renderComponent = () => {
    return render(
      <Provider store={store}>
        <MemoryRouter>
          <AddPlanPage />
        </MemoryRouter>
      </Provider>
    );
  };
  beforeEach(() => {
    vi.clearAllMocks();

    // Spy on useCreatePlanMutation
    vi.spyOn(configurationApiSlice, "useCreatePlanMutation").mockReturnValue([
      mockCreatePlan,
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
    vi.spyOn(configurationApiSlice, "useLazyGetCurrencyQuery").mockReturnValue([
      mockGetCurrencyData,
      { data: mockCurrency, isLoading: false, isError: false },
      { lastArg: undefined },
    ]);
    vi.spyOn(notistack, "useSnackbar").mockReturnValue({
      enqueueSnackbar: mockEnqueueSnackbar,
      closeSnackbar: vi.fn(),
    });
  });
  it("renders the AddPlanPage component correctly", () => {
    renderComponent();

    expect(screen.getByTestId("add-plan")).toBeInTheDocument();
  });

  it("renders the form with all required fields", async () => {
    renderComponent();

    expect(screen.getByLabelText(/Plan Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Price/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Subscription Type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Cluster/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Tag/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /Submit/i })).toBeDisabled();
    });
    expect(screen.getByRole("button", { name: /Cancel/i })).toBeInTheDocument();
  });

  it("submits the form successfully", async () => {
    renderComponent();
    await fillFormWithValidData();
    const submitButton = await screen.findByText("Submit");
    await waitFor(() => expect(submitButton).toBeEnabled());
    fireEvent.click(submitButton);

    await waitFor(async () => {
      expect(mockCreatePlan).toHaveBeenCalledWith(
        expect.objectContaining(mockData)
      );
    });
    await waitFor(() => {
      expect(mockEnqueueSnackbar).toHaveBeenCalledWith(
        "Plan Created Successfully",
        { variant: "success" }
      );
    });
  });

  it("shows validation errors when form fields are touched and left empty", async () => {
    renderComponent();

    const requiredFields = [
      { label: /Plan Name/i, errorMessage: "Plan name is required" },
      { label: /Price/i, errorMessage: "Amount is required" },
      {
        label: /Subscription Type/i,
        errorMessage: "Subscription Type is required",
      },
      { label: /Cluster/i, errorMessage: "Cluster is required" },
      { label: /Tag/i, errorMessage: "Tag is required" },
    ];

    for (const field of requiredFields) {
      const input = screen.getByLabelText(field.label);
      await userEvent.click(input);
      await userEvent.tab(); // Move focus away to trigger validation
    }
    await userEvent.tab();

    await waitFor(() => {
      requiredFields.forEach((field) => {
        expect(screen.getByText(field.errorMessage)).toBeInTheDocument();
      });

      // Verify submit button is disabled
      const submitButton = screen.getByRole("button", { name: /Submit/i });
      expect(submitButton).toBeDisabled();
    });
  });

  it("validation of PlanItemView Save & Close btn", async () => {
    renderComponent();

    fireEvent.click(screen.getByTestId("AddCircleOutlineIcon"));

    expect(screen.getByText(saveCloseBtn)).toBeDisabled();
    fireEvent.click(screen.getByTestId("AddIcon"));
    expect(screen.getByText(saveCloseBtn)).toBeEnabled();
    screen.getByText(saveCloseBtn).click();
  });

  it("validation of PlanItemView Close btn", async () => {
    renderComponent();

    fireEvent.click(screen.getByTestId("AddCircleOutlineIcon"));

    expect(screen.getByText(saveCloseBtn)).toBeDisabled();
    fireEvent.click(screen.getByTestId("AddIcon"));
    expect(screen.getByText(saveCloseBtn)).toBeEnabled();
    fireEvent.click(screen.getByTestId("CloseIcon"));
  });

  const fillFormWithValidData = async () => {
    // Fill plan name
    fireEvent.change(screen.getByLabelText(/Plan Name/i), {
      target: { value: "Test Plan" },
    });

    // Fill price
    fireEvent.change(screen.getByLabelText(/Price/i), {
      target: { value: 9999 },
    });

    // Select dropdowns
    await Promise.all(
      dropDownFields.map(async (field) => {
        const featureSelect = screen.getByLabelText(field.label);
        fireEvent.mouseDown(featureSelect);
        const options = await screen.findAllByRole("option");
        fireEvent.click(options[0]);
      })
    );
    fireEvent.click(screen.getByTestId("AddCircleOutlineIcon"));
    fireEvent.click(screen.getByTestId("AddIcon"));
    screen.getByText(saveCloseBtn).click();
    await waitFor(() => {
      expect(screen.queryByTestId("CloseIcon")).not.toBeInTheDocument();
    });
  };
});
