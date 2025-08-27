import { fireEvent, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import AddTenantPage from "./AddTenantPage";

import { PermissionsEnum } from "Constants/enums";
import NotificationProvider from "Providers/NotificationProvider";
import * as configurationApiSlice from "redux/app/featuresApiSlice";
import * as tenantApiSlice from "redux/app/tenantManagementApiSlice";
import { renderWithStore } from "Tests/utils/renderWithStore";
import {
  clusterData,
  customPlanMockData,
  features,
  standardPlanData,
  tagsData,
  tierData,
} from "../mockData";
import { steps } from "./addTenantsUtils";

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

describe("AddTenantPage", () => {
  beforeEach(() => {
    vi.spyOn(tenantApiSlice, "useGetClustersQuery").mockReturnValue({
      data: clusterData,
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    });
    vi.spyOn(tenantApiSlice, "useGetTiersQuery").mockReturnValue({
      data: tierData,
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    });
    vi.spyOn(tenantApiSlice, "useLazyGetPlansForTenantQuery").mockReturnValue([
      vi.fn(),
      {
        data: standardPlanData,
        isLoading: false,
        isError: false,
      },
      {
        lastArg: {} as any,
      },
    ]);
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
    vi.spyOn(configurationApiSlice, "useLazyGetFeaturesQuery").mockReturnValue([
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
    vi.spyOn(tenantApiSlice, "useGetTiersQuery").mockReturnValue({
      data: [{ value: "Standard", label: "Standard" }],
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    });
    vi.clearAllMocks();
  });

  const nextButtonId = "next-button";
  const backButtonId = "back-button";

  const renderComponent = () => {
    return renderWithStore(
      <NotificationProvider>
        <MemoryRouter>
          <AddTenantPage />
        </MemoryRouter>
      </NotificationProvider>,
      {
        preloadedState: {
          auth: { permissions: Object.values(PermissionsEnum) },
          api: {
            auth: { permissions: Object.values(PermissionsEnum) },
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

  const fillForm = () => {
    fireEvent.change(screen.getByLabelText(/first name/i), {
      target: { value: "John" },
    });
    fireEvent.change(screen.getByLabelText(/last name/i), {
      target: { value: "Doe" },
    });
    fireEvent.change(screen.getByLabelText(/company/i), {
      target: { value: "SAAS" },
    });
    fireEvent.change(screen.getByLabelText(/designation/i), {
      target: { value: "ADMIN" },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "john.doe@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/mobile number/i), {
      target: { value: "1234567890" },
    });
    fireEvent.change(screen.getByLabelText(/Language/i), {
      target: { value: "English" },
    });
    fireEvent.change(screen.getByLabelText(/subdomain/i), {
      target: { value: "subdomain" },
    });
    fireEvent.change(screen.getByLabelText(/tier/i), {
      target: { label: "Standard", value: "Standard" },
    });
  };

  it("renders the component", () => {
    renderComponent();
    expect(screen.getByTestId("AddTenantPage")).toBeInTheDocument();
  });

  it("renders stepper tab", () => {
    renderComponent();
    steps.forEach((step) => {
      const stepLabel = screen.getByText(step);
      expect(stepLabel).toBeInTheDocument();
    });
  });

  it("renders initial step content", () => {
    renderComponent();
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument(); // AddTenantDetails step
  });

  it("successfully submits the form and redirects", async () => {
    renderComponent();
    const nextButton = screen.getByTestId(nextButtonId);
    fillForm();

    expect(nextButton).toBeEnabled();
    fireEvent.click(nextButton);

    const backButton = screen.getByTestId(backButtonId);
    fireEvent.click(backButton);
    expect(nextButton).toBeEnabled();
    fireEvent.click(nextButton);
    expect(nextButton).toBeDisabled();
    const clusterSelect = screen.getByLabelText(/Cluster Type/i);
    fireEvent.mouseDown(clusterSelect);
    const clusterOptions = await screen.findAllByRole("option");
    fireEvent.click(clusterOptions[0]);
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

    await waitFor(() => {
      const successDialogTypography = screen.getByTestId("success-typography");
      expect(successDialogTypography).toBeInTheDocument();
    });
  });

  it("successfully renders custom plan form", async () => {
    renderComponent();
    vi.spyOn(tenantApiSlice, "useLazyGetPlansForTenantQuery").mockReturnValue([
      vi.fn(),
      {
        data: customPlanMockData,
        isLoading: false,
        isError: false,
      },
      {
        lastArg: {} as any,
      },
    ]);
    const nextButton = screen.getByTestId(nextButtonId);
    fillForm();

    expect(nextButton).toBeEnabled();
    fireEvent.click(nextButton);

    const backButton = screen.getByTestId(backButtonId);
    fireEvent.click(backButton);
    expect(nextButton).toBeEnabled();
    fireEvent.click(nextButton);
    expect(nextButton).toBeDisabled();
    const clusterSelect = screen.getByLabelText(/Cluster Type/i);
    fireEvent.mouseDown(clusterSelect);
    const clusterOptions = await screen.findAllByRole("option");
    fireEvent.click(clusterOptions[0]);
    expect(clusterSelect).toBeInTheDocument();

    const tagAccordion = screen.getByTestId("tag-customPlan");
    fireEvent.click(tagAccordion);
    const customSelect = screen.getByLabelText(/Custom Select/i);
    expect(customSelect).toBeInTheDocument();
    fireEvent.mouseDown(customSelect);
    const customOptions = await screen.findAllByRole("option");

    fireEvent.click(customOptions[0]);
    const customPlanCard = screen.getByTestId("custom-plan-card");
    expect(customPlanCard).toBeInTheDocument();

    expect(nextButton).toBeEnabled();
    fireEvent.click(nextButton);

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

    await waitFor(() => {
      const successDialogTypography = screen.getByTestId("success-typography");
      expect(successDialogTypography).toBeInTheDocument();
    });
  });

  it("maintains selected plans after navigating to upload screen then comes to plan page", async () => {
    renderComponent();
    const nextButton = screen.getByTestId("next-button");
    fillForm();

    expect(nextButton).toBeEnabled();
    fireEvent.click(nextButton);

    expect(nextButton).toBeDisabled();
    const clusterSelect = screen.getByLabelText(/Cluster Type/i);
    fireEvent.mouseDown(clusterSelect);
    const clusterOptions = await screen.findAllByRole("option");
    fireEvent.click(clusterOptions[0]);
    expect(clusterSelect).toBeInTheDocument();

    const tagAccordion = screen.getByTestId("tag-cpq");
    fireEvent.click(tagAccordion);
    fireEvent.click(tagAccordion);
    const priceSelect = screen.getByTestId("select-plan-standard-cpq");
    fireEvent.click(priceSelect);
    const priceSelect1 = screen.getByTestId("select-plan-plusImax-cpq");
    fireEvent.click(priceSelect1);
    fireEvent.click(priceSelect1);
    expect(nextButton).toBeDisabled();

    fireEvent.click(priceSelect);
    expect(nextButton).toBeEnabled();
    fireEvent.click(nextButton);
    const backButton = screen.getByTestId("back-button");
    fireEvent.click(backButton);

    const planCard = screen.getByTestId("plan-view-card");
    expect(planCard).toBeInTheDocument();
  });
});
