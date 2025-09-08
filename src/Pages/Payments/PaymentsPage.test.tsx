import { renderWithStore } from "Tests/utils/renderWithStore";
import { screen } from "@testing-library/react";
import { vi } from "vitest";
import PaymentsPage from "./PaymentsPage";
import { PermissionsEnum } from "Constants/enums/permissions";
import { paymentsData } from "./mockData";
import * as notistack from "notistack";
import { BrowserRouter } from "react-router-dom";

const MOCKED_DOWNLOAD_URL = "https://example.com/invoice.pdf";

vi.mock("redux/app/tenantManagementApiSlice", async (importOriginal) => {
  const originalModule = await importOriginal<
    typeof import("redux/app/tenantManagementApiSlice")
  >();
  return {
    ...originalModule,
    useGetPaymentDetailsQuery: () => ({
      data: paymentsData,
      isError: false,
      isLoading: false,
      refetch: vi.fn(),
    }),
    useGetPaymentDetailsCountQuery: () => ({
      data: paymentsData.length,
      isError: false,
      isLoading: false,
    }),
    useLazyGetInvoiceDownloadUrlQuery: () => [
      vi.fn().mockResolvedValue({ data: { file: MOCKED_DOWNLOAD_URL } }),
      { isLoading: false },
    ],
  };
});

describe("Payments Page Tests", () => {
  const mockEnqueueSnackbar = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    // Spy on useSnackbar
    vi.spyOn(notistack, "useSnackbar").mockReturnValue({
      enqueueSnackbar: mockEnqueueSnackbar,
      closeSnackbar: vi.fn(),
    });
  });

  it("should render the payment page", () => {
    renderWithStore(
      <BrowserRouter>
        <PaymentsPage />
      </BrowserRouter>,
      {
        preloadedState: {
          auth: { permissions: Object.values(PermissionsEnum) },
          api: {
            queries: {
              'getPaymentDetails({"limit":5,"offset":0,"sortBy":null})': {
                data: paymentsData,
                status: "fulfilled",
              },

              "getPaymentDetailsCount()": {
                data: { count: paymentsData.length },
                status: "fulfilled",
              },
            },
          },
        },
      }
    );
    const component = screen.getByTestId("payment-page");
    expect(component).toBeVisible();
  });
  it("should render Table Loader while loading", () => {
    renderWithStore(
      <BrowserRouter>
        <PaymentsPage />
      </BrowserRouter>,
      {
        preloadedState: {
          auth: { permissions: Object.values(PermissionsEnum) },
          api: {
            queries: {
              'getPaymentDetails({"filter":{"where":{"and":[]}},"limit":5,"offset":0,"sortBy":null})':
                {
                  status: "pending",
                  endpointName: "invoices",
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
});
