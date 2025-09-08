import { screen } from "@testing-library/react";
import { PermissionsEnum } from "Constants/enums/permissions";
import { renderWithStore } from "Tests/utils/renderWithStore";
import { vi } from "vitest";
import PlansPage from "./PlansPage";
import { dummyPlans } from "./PlanPage.utils";
import { MemoryRouter } from "react-router";

vi.mock("redux/app/tenantManagementApiSlice", async (importOriginal) => {
  const originalModule = await importOriginal<
    typeof import("redux/app/tenantManagementApiSlice")
  >();

  return {
    ...originalModule,
    useGetPlansQuery: () => ({
      data: dummyPlans,
      isError: false,
      isLoading: false,
    }),
  };
});

describe("Plans Page Tests", () => {
  it("should render the plan page", () => {
    renderWithStore(
      <MemoryRouter>
        <PlansPage />
      </MemoryRouter>,
      {
        preloadedState: {
          auth: { permissions: Object.values(PermissionsEnum) },
          api: {
            queries: {
              'getPlans({"filter":{"where":{"and":[]}},"limit":5,"offset":0,"sortBy":null})':
                {
                  data: dummyPlans,
                  status: "fulfilled",
                },
            },
          },
        },
      }
    );
    const component = screen.getByTestId("plan-page");
    expect(component).toBeVisible();
  });

  it("should render Table Loader while loading", () => {
    renderWithStore(
      <MemoryRouter>
        <PlansPage />
      </MemoryRouter>,
      {
        preloadedState: {
          auth: { permissions: Object.values(PermissionsEnum) },
          api: {
            queries: {
              'getPlans({"filter":{"where":{"and":[]}},"limit":5,"offset":0,"sortBy":null})':
                {
                  status: "pending",
                  endpointName: "getPlans",
                  requestId: "",
                },
            },
          },
        },
      }
    );

    const tableLoader = screen.getByTestId("table-loader");
    expect(tableLoader).toBeInTheDocument();
  });

  it("should render No data view if no data", () => {
    renderWithStore(
      <MemoryRouter>
        <PlansPage />
      </MemoryRouter>,
      {
        preloadedState: {
          auth: { permissions: Object.values(PermissionsEnum) },
          api: {
            queries: {
              'getPlans({"filter":{"where":{"and":[]}},"limit":5,"offset":0,"sortBy":null})':
                {
                  data: [],
                  status: "fulfilled",
                },
            },
          },
        },
      }
    );

    const noDataView = screen.getByText(/No Results Found./i);
    expect(noDataView).toBeInTheDocument();
  });
});
