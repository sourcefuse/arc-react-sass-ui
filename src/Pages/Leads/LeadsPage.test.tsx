import { screen } from "@testing-library/react";
import { PermissionsEnum } from "Constants/enums/permissions";
import { renderWithStore } from "Tests/utils/renderWithStore";
import { vi } from "vitest";
import LeadsPage from "./LeadsPage";
import { SnackbarProvider } from "notistack";
import { dummyLeads } from "./LeadsPage.utils";
import { MemoryRouter } from "react-router-dom";

vi.mock("redux/app/tenantManagementApiSlice", async (importOriginal) => {
  const originalModule = await importOriginal<
    typeof import("redux/app/tenantManagementApiSlice")
  >();

  return {
    ...originalModule,
    useGetLeadsQuery: () => ({
      data: dummyLeads,
      isError: false,
      isLoading: false,
    }),
  };
});

describe("Leads Page Tests", () => {
  it("should render the lead page", () => {
    renderWithStore(
      <MemoryRouter>
        <SnackbarProvider>
          <LeadsPage />
        </SnackbarProvider>
      </MemoryRouter>,
      {
        preloadedState: {
          auth: { permissions: Object.values(PermissionsEnum) },
          api: {
            queries: {
              'getLeads({"filter":{"where":{"and":[]}},"limit":5,"offset":0,"sortBy":null})':
                {
                  data: dummyLeads,
                  status: "fulfilled",
                },
            },
          },
        },
      }
    );
    const component = screen.getByTestId("lead-page");
    expect(component).toBeVisible();
  });

  it("should render Table Loader while loading", () => {
    renderWithStore(
      <MemoryRouter>
        <SnackbarProvider>
          <LeadsPage />
        </SnackbarProvider>
      </MemoryRouter>,
      {
        preloadedState: {
          auth: { permissions: Object.values(PermissionsEnum) },
          api: {
            queries: {
              'getLeads({"filter":{"where":{"and":[]}},"limit":5,"offset":0,"sortBy":null})':
                {
                  status: "pending",
                  endpointName: "getLeads",
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
        <SnackbarProvider>
          <LeadsPage />
        </SnackbarProvider>
      </MemoryRouter>,
      {
        preloadedState: {
          auth: { permissions: Object.values(PermissionsEnum) },
          api: {
            queries: {
              'getLeads({"filter":{"where":{"and":[]}},"limit":5,"offset":0,"sortBy":null})':
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
