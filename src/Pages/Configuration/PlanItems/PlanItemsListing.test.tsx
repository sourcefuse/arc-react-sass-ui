import { screen, waitFor } from "@testing-library/react";
import PlanItemsListing from "./PlanItemsListing";
import { MemoryRouter } from "react-router-dom";
import { describe, it, beforeEach, expect, vi } from "vitest";
import { renderWithStore } from "Tests/utils/renderWithStore";
import * as configurationApiSlice from "redux/app/planItemsApiSlice";
import * as permissionHook from "Hooks/usePermission";

const mockPlanItems = [
  {
    id: "1-1-2-2-4",
    name: "Basic Plan",
    description: "Basic features plan",
    createdOn: "2024-01-01",
    modifiedOn: "2024-01-02",
  },
  {
    id: "2-24-3-23-322-3",
    name: "Premium Plan",
    description: "Premium features plan",
    createdOn: "2024-01-03",
    modifiedOn: "2024-01-04",
  },
];

const mockGetPlanItems = vi.fn();
const mockGetPlanItemsCount = vi.fn();

describe("PlanItems Listing Page", () => {
  const mockedPlanItemListingHooks = (
    args = { data: mockPlanItems, isLoading: false, isError: false }
  ) => {
    const { data } = args;
    vi.spyOn(configurationApiSlice, "useLazyGetPlanItemsQuery").mockReturnValue(
      [mockGetPlanItems, args, { lastArg: {} }]
    );

    vi.spyOn(
      configurationApiSlice,
      "useLazyGetPlanItemsCountQuery"
    ).mockReturnValue([
      mockGetPlanItemsCount,
      { data: { count: data?.length ?? 0 } },
      { lastArg: {} },
    ]);
  };

  beforeEach(() => {
    vi.clearAllMocks();

    mockedPlanItemListingHooks();
    vi.spyOn(permissionHook, "usePermission").mockReturnValue(true);
  });

  const renderComponent = () => {
    return renderWithStore(
      <MemoryRouter>
        <PlanItemsListing />
      </MemoryRouter>
    );
  };

  it("renders the plan items table correctly", async () => {
    renderComponent();

    expect(screen.getByText("Plan Items")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Add Plan Items/i })
    ).toBeInTheDocument();

    expect(screen.getByText("Plan Item Name")).toBeInTheDocument();
    expect(screen.getByText("Created Date")).toBeInTheDocument();
    expect(screen.getByText("Plan Modified Date")).toBeInTheDocument();
  });

  it("displays plan items data correctly", () => {
    renderComponent();

    mockPlanItems.forEach((item) => {
      expect(screen.getByText(item.name)).toBeInTheDocument();
    });
  });

  it("shows loading state while fetching data", () => {
    mockedPlanItemListingHooks({ isLoading: true, data: [], isError: false });

    renderComponent();
    expect(screen.getByTestId("table-loader")).toBeInTheDocument();
  });

  it("shows error state when API fails", () => {
    mockedPlanItemListingHooks({ isLoading: false, data: [], isError: true });

    renderComponent();
    expect(screen.getByTestId("table-error")).toBeInTheDocument();
  });

  it("shows no data view when there are no plan items", async () => {
    mockedPlanItemListingHooks({ isLoading: false, data: [], isError: false });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText(/No Results Found./i)).toBeInTheDocument();
    });
  });
});
