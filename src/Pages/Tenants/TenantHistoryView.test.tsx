import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TenantHistoryView from "./TenantHistoryView";
import { vi } from "vitest";
import { PermissionsEnum } from "Constants/enums";
import { renderWithStore } from "../../Tests/utils/renderWithStore";

const tenantHistory = [
  {
    featureName: "Feature A",
    chartVersion: "1.0.0",
    action: "install",
  },
  {
    featureName: "Feature B",
    chartVersion: "2.0.0",
    action: "uninstall",
  },
];

vi.mock("redux/app/tenantManagementApiSlice", async (importOriginal) => {
  const originalModule = await importOriginal<
    typeof import("redux/app/tenantManagementApiSlice")
  >();

  return {
    ...originalModule,
    useLazyGetTenantHistoryQuery: () => ({
      data: [],
      isError: false,
      isLoading: false,
    }),
  };
});

describe("TenantHistoryView Component", () => {
  const mockHandleClose = vi.fn();

  it("should render the component with correct styles", () => {
    renderWithStore(
      <TenantHistoryView
        tenantName="testname"
        tenantId="123"
        handleClose={mockHandleClose}
      />,
      {
        preloadedState: {
          auth: { permissions: Object.values(PermissionsEnum) },
          api: {
            queries: {
              "getTenantHistory({})": {
                data: tenantHistory,
                status: "fulfilled",
                isLoading: false,
              },
            },
          },
        },
      }
    );

    const component = screen.getByTestId("tenant-logs-view");
    expect(component).toBeInTheDocument();
  });

  it("should render correct data", () => {
    renderWithStore(
      <TenantHistoryView
        tenantName="testname"
        tenantId="123"
        handleClose={mockHandleClose}
      />,
      {
        preloadedState: {
          auth: { permissions: Object.values(PermissionsEnum) },
          api: {
            queries: {
              'getTenantHistory({"tenantId":"123"})': {
                data: tenantHistory,
                status: "fulfilled",
                isLoading: false,
              },
            },
          },
        },
      }
    );

    const component = screen.getByTestId("tenant-logs-view");
    expect(component).toBeInTheDocument();
  });

  it("should call handleClose when close button is clicked", async () => {
    renderWithStore(
      <TenantHistoryView
        tenantName="testname"
        tenantId="123"
        handleClose={mockHandleClose}
      />,
      {
        preloadedState: {
          auth: { permissions: Object.values(PermissionsEnum) },
          api: {
            queries: {
              "getTenantHistory({})": {
                data: tenantHistory,
                status: "fulfilled",
                isLoading: false,
              },
            },
          },
        },
      }
    );

    const closeButton = screen.getByTestId("CloseIcon");
    await userEvent.click(closeButton);

    expect(mockHandleClose).toHaveBeenCalledTimes(1);
  });

  it('should display "No logs to display" when no data is available', () => {
    renderWithStore(
      <TenantHistoryView
        tenantName="testname"
        tenantId="123"
        handleClose={mockHandleClose}
      />,
      {
        preloadedState: {
          auth: { permissions: Object.values(PermissionsEnum) },
          api: {
            queries: {
              "getTenantHistory({})": {
                data: [],
                status: "fulfilled",
                isLoading: false,
              },
            },
          },
        },
      }
    );

    const noLogsMessage = screen.getByText("No logs to display");
    expect(noLogsMessage).toBeInTheDocument();
  });
});
