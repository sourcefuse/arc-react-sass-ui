import { fireEvent, screen, waitFor } from "@testing-library/react";
import { describe, it, vi, beforeEach, expect } from "vitest";
import PlanView from "./PlanView";
import * as configurationApi from "redux/app/configurationApiSlice";
import * as tenantApi from "redux/app/tenantManagementApiSlice";
import { renderWithStore } from "Tests/utils/renderWithStore";

// Mock child components

// Setup test data
const planData = {
  name: "Test Plan",
  amount: "100",
  clusterId: "cluster1",
  tierId: "tier1",
  billingCycleId: "billing1",
  planTagIds: [1],
  planItemIds: [{ label: "Item 1" }],
};

describe("PlanView Component", () => {
  const mockPlanId = "123";
  const mockHandleClose = vi.fn();

  beforeEach(() => {
    vi.spyOn(configurationApi, "useGetPlanByIdQuery").mockReturnValue({
      data: planData,
      isLoading: false,
      isFetching: false,
    } as any);

    vi.spyOn(configurationApi, "useLazyGetPlanItemByIdQuery").mockReturnValue([
      vi.fn(),
      {
        data: [],
        isFetching: false,
      },
    ] as any);

    vi.spyOn(tenantApi, "useGetClustersSelectQuery").mockReturnValue({
      data: [{ value: "cluster1", label: "Cluster A" }],
    } as any);

    vi.spyOn(tenantApi, "useGetTiersQuery").mockReturnValue({
      data: [{ value: "tier1", label: "Tier One" }],
      isLoading: false,
    } as any);

    vi.spyOn(tenantApi, "useGetBillingCyclesQuery").mockReturnValue({
      data: [{ id: "billing1", cycleName: "Monthly" }],
    } as any);

    vi.spyOn(tenantApi, "useGetTagsQuery").mockReturnValue({
      data: [{ id: 1, name: "Premium" }],
      isLoading: false,
    } as any);
  });

  it("renders loading state", () => {
    vi.spyOn(tenantApi, "useGetTiersQuery").mockReturnValue({
      data: [{ value: "tier1", label: "Tier One" }],
      isLoading: true,
    } as any);

    renderWithStore(
      <PlanView planId={mockPlanId} handleCloseModal={mockHandleClose} />
    );
    expect(screen.getByTestId("circular-progress")).toBeInTheDocument();
  });

  it("renders close button", async () => {
    renderWithStore(
      <PlanView planId={mockPlanId} handleCloseModal={mockHandleClose} />
    );

    await waitFor(() => {
      expect(screen.getByTestId("plan-view")).toBeInTheDocument();
    });

    const closeBtn = screen.getByRole("button", { name: /close/i });
    fireEvent.click(closeBtn);
    expect(mockHandleClose).toHaveBeenCalled();
  });

  it("renders plan details when data is available", async () => {
    renderWithStore(
      <PlanView planId={mockPlanId} handleCloseModal={mockHandleClose} />
    );

    await waitFor(() => {
      expect(screen.getByTestId("plan-view")).toBeInTheDocument();
    });

    expect(screen.getByText(planData.name)).toBeInTheDocument();
    expect(screen.getByText(planData.amount)).toBeInTheDocument();
    expect(screen.getByText("Cluster A")).toBeInTheDocument();
    expect(screen.getByText("Monthly")).toBeInTheDocument();
  });

  it("renders features section when data is available", async () => {
    const mockPlanItemNode = {
      planValue: [
        { name: "Feature A", chart_version: "1.0" },
        { name: "Feature B", chart_version: "2.0" },
      ],
    };

    vi.spyOn(configurationApi, "useLazyGetPlanItemByIdQuery").mockReturnValue([
      vi.fn(),
      {
        data: mockPlanItemNode,
        isFetching: false,
      },
    ] as any);

    renderWithStore(
      <PlanView planId={mockPlanId} handleCloseModal={mockHandleClose} />
    );

    await waitFor(() => {
      expect(screen.getByTestId("plan-view")).toBeInTheDocument();
    });

    expect(screen.getByText("Feature A (1.0)")).toBeInTheDocument();
    expect(screen.getByText("Feature B (2.0)")).toBeInTheDocument();
  });

  it("renders skeleton loader when plan items are fetching", async () => {
    vi.spyOn(configurationApi, "useLazyGetPlanItemByIdQuery").mockReturnValue([
      vi.fn(),
      {
        data: [],
        isFetching: true,
      },
    ] as any);

    renderWithStore(
      <PlanView planId={mockPlanId} handleCloseModal={mockHandleClose} />
    );

    await waitFor(() => {
      expect(screen.getByTestId("plan-view")).toBeInTheDocument();
    });

    expect(screen.getAllByTestId("loader")).toHaveLength(9);
  });
});
