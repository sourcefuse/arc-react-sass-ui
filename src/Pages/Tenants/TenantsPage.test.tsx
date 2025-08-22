import { fireEvent, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { PermissionsEnum } from "../../Constants/enums";
import { renderWithStore } from "../../Tests/utils/renderWithStore";
import TenantsPage from "./TenantsPage";
import { dummyTenant, getStatusLabel } from "./tenants.utils";

vi.mock("redux/app/tenantManagementApiSlice", async (importOriginal) => {
  const originalModule = await importOriginal<
    typeof import("redux/app/tenantManagementApiSlice")
  >();

  return {
    ...originalModule,
    useLazyGetTenantsQuery: () => ({
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

describe("Tenants Page Tests", () => {
  it("should render the tenant page", () => {
    renderWithStore(
      <BrowserRouter>
        <TenantsPage />
      </BrowserRouter>,
      {
        preloadedState: {
          auth: { permissions: Object.values(PermissionsEnum) },
          api: {
            queries: {
              'getTenants({"filter":{"where":{"and":[]}},"limit":5,"offset":0,"sortBy":null})':
                {
                  data: dummyTenant,
                  status: "fulfilled",
                },
            },
          },
        },
      }
    );
    const component = screen.getByTestId("tenants-page");
    expect(component).toBeVisible();
  });

  it("renders Add Tenant button", () => {
    renderWithStore(
      <BrowserRouter>
        <TenantsPage />
      </BrowserRouter>,
      {
        preloadedState: {
          auth: { permissions: Object.values(PermissionsEnum) },
          api: {
            queries: {
              'getTenants({"filter":{"where":{"and":[]}},"limit":5,"offset":0,"sortBy":null})':
                {
                  data: dummyTenant,
                  status: "fulfilled",
                },
            },
          },
        },
      }
    );
    const addButton = screen.getByRole("button", { name: /Add Tenant/i });
    expect(addButton).toBeInTheDocument();
  });

  it("should render Add Tenant button if no data", () => {
    renderWithStore(
      <BrowserRouter>
        <TenantsPage />
      </BrowserRouter>,
      {
        preloadedState: {
          auth: { permissions: Object.values(PermissionsEnum) },
          api: {
            queries: {
              'getTenants({"filter":{"where":{"and":[]}},"limit":5,"offset":0,"sortBy":null})':
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

    const addButton = screen.getByTestId("add-tenant-btn");
    expect(addButton).toBeInTheDocument();
  });

  it("should render Table Loader while loading", () => {
    renderWithStore(
      <BrowserRouter>
        <TenantsPage />
      </BrowserRouter>,
      {
        preloadedState: {
          auth: { permissions: Object.values(PermissionsEnum) },
          api: {
            queries: {
              'getTenants({"filter":{"where":{"and":[]}},"limit":5,"offset":0,"sortBy":null})':
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

  it("renders TenantsPage with tenant data", () => {
    renderWithStore(
      <BrowserRouter>
        <TenantsPage />
      </BrowserRouter>,
      {
        preloadedState: {
          auth: { permissions: Object.values(PermissionsEnum) },
          api: {
            queries: {
              'getTenants({"filter":{"where":{"and":[]}},"limit":5,"offset":0,"sortBy":null})':
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
    const tableElement = screen.getByTestId("tenants-page");
    expect(tableElement).toBeInTheDocument();

    // Check if the tenant data is rendered
    dummyTenant.forEach((tenant) => {
      const tenantName = screen.getByText(tenant.tenantName);
      const tenantPlan = screen.getByText(tenant.planName);
      const tenantStatusName = getStatusLabel(tenant.status);
      const tenantStatus = screen.getByText(tenantStatusName);

      expect(tenantName).toBeInTheDocument();
      expect(tenantPlan).toBeInTheDocument();
      expect(tenantStatus).toBeInTheDocument();
    });
  });
  it("should view tenant details when clicking on a tenant row", async () => {
    renderWithStore(
      <BrowserRouter>
        <TenantsPage />
      </BrowserRouter>,
      {
        preloadedState: {
          auth: { permissions: Object.values(PermissionsEnum) },
          api: {
            queries: {
              'getTenants({"filter":{"where":{"and":[]}},"limit":5,"offset":0,"sortBy":null})':
                {
                  data: dummyTenant,
                  status: "fulfilled",
                },
            },
          },
        },
      }
    );

    // Click on the first tenant row
    fireEvent.click(screen.getByText("TechCorp HQ"));

    // Wait for modal to appear
    await waitFor(() => {
      expect(screen.getByTestId("tenant-view")).toBeInTheDocument();
      // eslint-disable-next-line testing-library/no-wait-for-multiple-assertions
      expect(screen.getByText("TechCorp HQ")).toBeInTheDocument();
    });

    // Close the modal
    fireEvent.click(screen.getByText("Close"));

    // Ensure modal is closed
    await waitFor(() => {
      expect(screen.queryByTestId("tenant-view")).not.toBeInTheDocument();
    });
  });
});
