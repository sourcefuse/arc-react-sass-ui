import { screen, fireEvent, waitFor } from "@testing-library/react";
import EditTenantPage from "./EditTenantPage";
import { vi } from "vitest";
import * as tenantApiSlice from "redux/app/tenantManagementApiSlice";
import {
  billingCycleData,
  clusterData,
  features,
  mockedTenantData,
  standardPlanData,
  tagsData,
  tierData,
} from "../mockData";
import * as configurationApiSlice from "redux/app/featuresApiSlice";
import { PermissionsEnum } from "Constants/enums";
import NotificationProvider from "Providers/NotificationProvider";
import { MemoryRouter } from "react-router";
import { renderWithStore } from "Tests/utils/renderWithStore";
const nextButtonId = "next-button";

const mockEnqueueSnackbar = vi.fn();
// Mock notistack
vi.mock("notistack", () => ({
  __esModule: true,
  useSnackbar: () => ({
    enqueueSnackbar: mockEnqueueSnackbar,
    closeSnackbar: vi.fn(),
  }),
}));

vi.mock("react-router-dom", () => ({
  ...vi.importActual("react-router-dom"), // Keep the actual implementation of other hooks
}));

const renderComponent = () => {
  return renderWithStore(
    <NotificationProvider>
      <MemoryRouter>
        <EditTenantPage />
      </MemoryRouter>
    </NotificationProvider>,
    {
      preloadedState: {
        auth: { permissions: [PermissionsEnum.ViewTenant] },
        api: {
          auth: { permissions: [PermissionsEnum.ViewTenant] },
          mutations: {},
        },
        config: {
          configData: {
            tenantApiBaseUrl: "http://localhost:3000",
          },
        },
      },
    }
  );
};

describe("EditTenantPage", () => {
  beforeEach(() => {
    beforeEach(() => {
      vi.spyOn(tenantApiSlice, "useGetClustersQuery").mockReturnValue({
        data: clusterData,
        isLoading: false,
        isError: false,
        refetch: vi.fn(),
      });
      vi.spyOn(tenantApiSlice, "useLazyGetTenantByIdQuery").mockReturnValue([
        vi.fn(),
        {
          data: mockedTenantData,
          isLoading: false,
          isError: false,
        },
        {
          lastArg: {} as any,
        },
      ]);
      vi.spyOn(tenantApiSlice, "useGetTiersQuery").mockReturnValue({
        data: tierData,
        isLoading: false,
        isError: false,
        refetch: vi.fn(),
      });
      vi.spyOn(tenantApiSlice, "useLazyGetPlansForTenantQuery").mockReturnValue(
        [
          vi.fn(),
          {
            data: standardPlanData,
            isLoading: false,
            isError: false,
          },
          {
            lastArg: {} as any,
          },
        ]
      );
      vi.spyOn(tenantApiSlice, "useLazyGetTagsQuery").mockReturnValue([
        vi.fn(),
        {
          data: tagsData,
          isLoading: false,
          isError: false,
        },
        {
          lastArg: {} as any,
        },
      ]);
      vi.spyOn(
        configurationApiSlice,
        "useLazyGetFeaturesQuery"
      ).mockReturnValue([
        vi.fn(),
        {
          data: features,
          isLoading: false,
          isError: false,
        },
        {
          lastArg: {} as any,
        },
      ]);
      vi.spyOn(tenantApiSlice, "useLazyGetBillingCyclesQuery").mockReturnValue([
        vi.fn(),
        {
          data: billingCycleData,
          isLoading: false,
          isError: false,
        },
        {
          lastArg: {} as any,
        },
      ]);
      vi.clearAllMocks();
    });
  });

  it("renders the edit tenant form with existing details", async () => {
    renderComponent();
    await fillFormWithValidData();
    expect(await screen.findByLabelText(/company/i)).toBeInTheDocument();
    expect(await screen.findByLabelText(/designation/i)).toBeInTheDocument();
  });

  it("updates tenant details on form submission", async () => {
    renderComponent();
    const companyInput = await screen.findByLabelText(/company/i);

    const nextButton = screen.getByTestId(nextButtonId);

    await waitFor(() => expect(nextButton).toBeEnabled());
    fireEvent.change(companyInput, { target: { value: "Updated Company" } });
    fireEvent.click(nextButton);
    const clusterSelect = screen.getByLabelText(/Cluster Type/i);
    fireEvent.mouseDown(clusterSelect);
    expect(clusterSelect).toBeInTheDocument();

    const tagAccordion = screen.getByTestId("tag-cpq");
    fireEvent.click(tagAccordion);
    const priceSelect = screen.getByTestId("select-plan-standard-cpq");
    fireEvent.click(priceSelect);

    expect(nextButton).toBeEnabled();
    fireEvent.click(nextButton);

    // eslint-disable-next-line sonarjs/no-duplicate-string
    const pdfContent = new Blob(["PDF content"], { type: "application/pdf" });
    const file = new File([pdfContent], "test.pdf", {
      type: "application/pdf",
    });
    const dropZone = screen.getByTestId("file-drop-zone-input");
    const data = {
      dataTransfer: {
        files: [file],
        items: [
          {
            kind: "file",
            getAsFile: () => file,
          },
        ],
        types: ["Files"],
      },
    };
    fireEvent.drop(dropZone, data);

    await waitFor(() => {
      const submitButton = screen.getByTestId("submit-button");

      expect(submitButton).toBeEnabled();
      // eslint-disable-next-line testing-library/no-wait-for-side-effects
      fireEvent.click(submitButton);
    });
  });

  const fillFormWithValidData = async () => {
    const nameInput = await screen.findByLabelText(/company/i);
    const designationInput = await screen.findByLabelText(/designation/i);
    const emailInput = screen.getByLabelText(/email/i);

    fireEvent.change(nameInput, { target: { value: "Updated Tenant" } });
    fireEvent.change(designationInput, { target: { value: "Engineer" } });
    fireEvent.change(nameInput, { target: { value: "Updated Tenant" } });
    fireEvent.change(emailInput, { target: { value: "updated@tenant.com" } });
  };
});
