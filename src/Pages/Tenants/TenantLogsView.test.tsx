import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TenantLogsView from "./TenantLogsView";
import { vi } from "vitest";
import { PermissionsEnum } from "Constants/enums";
import { renderWithStore } from "../../Tests/utils/renderWithStore";

const tenantLogs = [
  {
    message: {
      stageName: "Preparing",
      stageStatus: "Started",
    },
    createdOn: "2025-04-21T14:54:27.012Z",
  },
];
vi.mock("redux/app/tenantManagementApiSlice", async (importOriginal) => {
  const originalModule = await importOriginal<
    typeof import("redux/app/tenantManagementApiSlice")
  >();

  return {
    ...originalModule,
    useLazyGetTenantLogsQuery: () => ({
      data: [],
      isError: false,
      isLoading: false,
    }),
  };
});

describe("TenantLogsView Component", () => {
  const mockHandleTenantLogsViewClose = vi.fn();

  it("should render the component with correct styles", () => {
    renderWithStore(
      <TenantLogsView
        logs={tenantLogs}
        handleClose={mockHandleTenantLogsViewClose}
        tenantId={""}
        name={""}
      />,
      {
        preloadedState: {
          auth: { permissions: Object.values(PermissionsEnum) },
          api: {
            queries: {
              "getTenantLogs({})": {
                data: [],
                status: "fulfilled",
              },
            },
          },
        },
      }
    );

    const component = screen.getByTestId("tenant-logs-view");
    expect(component).toBeInTheDocument();
  });

  it("should call handleTenantLogsViewClose when close button is clicked", async () => {
    renderWithStore(
      <TenantLogsView
        logs={tenantLogs}
        handleClose={mockHandleTenantLogsViewClose}
        tenantId={""}
        name={""}
      />,
      {
        preloadedState: {
          auth: { permissions: Object.values(PermissionsEnum) },
          api: {
            queries: {
              "getTenantLogs({})": {
                data: [],
                status: "fulfilled",
              },
            },
          },
        },
      }
    );

    const closeButton = screen.getByTestId("CloseIcon");
    await userEvent.click(closeButton);

    expect(mockHandleTenantLogsViewClose).toHaveBeenCalledTimes(1);
  });
  it("should call render correct data", async () => {
    renderWithStore(
      <TenantLogsView
        logs={tenantLogs}
        handleClose={mockHandleTenantLogsViewClose}
        tenantId={""}
        name={""}
      />,
      {
        preloadedState: {
          auth: { permissions: Object.values(PermissionsEnum) },
          api: {
            queries: {
              "getTenantLogs({})": {
                data: [],
                status: "fulfilled",
              },
            },
          },
        },
      }
    );

    const stageStatus = screen.getByText("Started");
    const stageName = screen.getByText("Preparing");
    expect(stageStatus).toBeInTheDocument();
    expect(stageName).toBeInTheDocument();
  });
});
