import { BrowserRouter } from "react-router-dom";
import { renderWithStore } from "Tests/utils/renderWithStore";
import { describe, expect, it, vi } from "vitest";
import Dashboard from "./Dashboard";
import { dummyTenant, getStatusLabel } from "Pages/Tenants/tenants.utils";
import { PermissionsEnum } from "Constants/enums";
import { screen } from "@testing-library/react";

vi.mock("redux/app/tenantManagementApiSlice", async (importOriginal) => {
  const originalModule = await importOriginal<
    typeof import("redux/app/tenantManagementApiSlice")
  >();

  return {
    ...originalModule,
    useGetTenantsQuery: () => ({
      data: [],
      isError: false,
      isLoading: false,
    }),
    useGetTenantsCountQuery: () => ({
      data: [],
      isError: false,
      isLoading: false,
    }),
    useGetPlansCountQuery: () => ({
      data: [],
      isError: false,
      isLoading: false,
    }),
  };
});

vi.mock("react-router-dom", () => {
  const originalModule = vi.importActual("react-router-dom");
  return {
    ...originalModule,
    useNavigate: () => vi.fn(),
  };
});

describe("Dashboard Tests", () => {
  it("should render the dashboard", () => {
    renderWithStore(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>,
      {
        preloadedState: {
          auth: { permissions: Object.values(PermissionsEnum) },
          api: {
            queries: {
              'getTenants({"filter":{"where":{"and":[]}},"limit":5,"offset":0})':
                {
                  data: dummyTenant,
                  status: "fulfilled",
                },
            },
          },
        },
      }
    );
    const component = screen.getByTestId("HomePage");
    expect(component).toBeVisible();
  });

  it("should render Table Loader while loading", () => {
    renderWithStore(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>,
      {
        preloadedState: {
          auth: { permissions: Object.values(PermissionsEnum) },
          api: {
            queries: {
              'getTenants({"filter":{"where":{"and":[]}},"limit":5,"offset":0})':
                {
                  status: "pending",
                  endpointName: "getTenants",
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

  it("renders Table in dashboard with tenant data", () => {
    renderWithStore(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>,
      {
        preloadedState: {
          auth: { permissions: Object.values(PermissionsEnum) },
          api: {
            queries: {
              'getTenants({"filter":{"where":{"and":[]}},"limit":3,"offset":0})':
                {
                  data: dummyTenant,
                  status: "fulfilled",
                  isLoading: false,
                },
            },
          },
        },
      }
    );

    // Check if the table is rendered
    const tableElement = screen.getByTestId("HomePage");
    expect(tableElement).toBeInTheDocument();

    // Check if the tenant data is rendered
    dummyTenant.slice(3).forEach((tenant) => {
      const tenantName = screen.getByText(tenant.tenantName);
      const tenantPlan = screen.getByText(tenant.planName);
      const tenantStatusName = getStatusLabel(tenant.status);
      const tenantStatus = screen.getByText(tenantStatusName);

      expect(tenantName).toBeInTheDocument();
      expect(tenantPlan).toBeInTheDocument();
      expect(tenantStatus).toBeInTheDocument();
    });
  });

  it("renders Stats in dashboard with count data", () => {
    renderWithStore(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>,
      {
        preloadedState: {
          auth: { permissions: Object.values(PermissionsEnum) },
          api: {
            queries: {
              'getTenantsCount({"where":{"and":[{"status":{"nin":["5"]}}]}})': {
                data: { count: 19 },
                status: "fulfilled",
                isLoading: false,
              },
              'getPlansCount({"where":{"and":[{"status":{"nin":["1"]}}]}})': {
                data: { count: 9 },
                status: "fulfilled",
                isLoading: false,
              },
            },
          },
        },
      }
    );

    // Check if the table is rendered
    screen.getByTestId("HomePage");

    const tenantCount = screen.getByText("19");
    const planCount = screen.getByText("9");
    expect(tenantCount).toBeInTheDocument();
    expect(planCount).toBeInTheDocument();
  });
});
