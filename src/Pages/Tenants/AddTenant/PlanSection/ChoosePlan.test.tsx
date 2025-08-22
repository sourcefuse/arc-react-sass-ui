import { fireEvent, screen, within } from "@testing-library/react";
import { Formik } from "formik";
import * as notistack from "notistack";
import {
  billingCycleData,
  clusterData,
  features,
  standardPlanData,
  tagsData,
} from "Pages/Tenants/mockData";
import * as configurationApiSlice from "redux/app/configurationApiSlice";
import * as tenantApiSlice from "redux/app/tenantManagementApiSlice";
import { renderWithStore } from "Tests/utils/renderWithStore";
import { vi } from "vitest";
import ChoosePlan from "./ChoosePlan";
import { initialAddTenantValues } from "../addTenantsUtils";

describe("ChoosePlan Component", () => {
  const mockUseLazyGetPlansForTenantQuery = (
    args = { data: standardPlanData, isFetching: false, isError: false }
  ) => {
    vi.spyOn(tenantApiSlice, "useLazyGetPlansForTenantQuery").mockReturnValue([
      vi.fn(),
      args,
      {
        lastArg: {} as any,
      },
    ]);
  };

  beforeEach(() => {
    vi.spyOn(tenantApiSlice, "useGetClustersQuery").mockReturnValue({
      data: clusterData,
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    });
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
    mockUseLazyGetPlansForTenantQuery();
  });

  const renderComponent = () => {
    return renderWithStore(
      <Formik initialValues={initialAddTenantValues} onSubmit={() => {}}>
        <ChoosePlan
          handleNextButton={vi.fn()}
          onChangeCluster={vi.fn()}
          cluster={""}
          overAllPlans={[]}
          onHandlePlan={vi.fn()}
          customSelectedPlan={undefined}
          onHandleCustomPlan={vi.fn()}
        />
      </Formik>
    );
  };

  const mockEnqueueSnackbar = vi.fn();
  // Mock notistack
  vi.spyOn(notistack, "useSnackbar").mockReturnValue({
    enqueueSnackbar: mockEnqueueSnackbar,
    closeSnackbar: vi.fn(),
  });
  const clusterTypeId = "cluster-type-select";
  it("handles cluster selection correctly", async () => {
    renderComponent();
    const selectBox = screen.getByTestId(clusterTypeId);
    fireEvent.mouseDown(selectBox);

    const featureSelect = screen.getByLabelText(/Cluster Type/i);
    fireEvent.mouseDown(featureSelect);
    const options = await screen.findAllByRole("option");
    fireEvent.click(options[0]);
    const tagAccordion = screen.getByTestId("tag-cpq");
    fireEvent.click(tagAccordion);
    const priceSelect = screen.getByTestId("select-plan-standard-cpq");
    expect(priceSelect).toBeInTheDocument();
  });

  it("To trigger tags and billing cycle", async () => {
    renderComponent();
    const selectBox = screen.getByTestId(clusterTypeId);
    fireEvent.mouseDown(selectBox);

    const featureSelect = screen.getByLabelText(/Cluster Type/i);
    fireEvent.mouseDown(featureSelect);
    const options = await screen.findAllByRole("option");

    fireEvent.click(options[0]);

    const tagAccordion = screen.getByTestId("tag-cpq");
    fireEvent.click(tagAccordion);
    const yearlyCycleButton = screen.getByTestId("yearly-cycle-cpq");
    expect(yearlyCycleButton).toBeInTheDocument();
    fireEvent.click(yearlyCycleButton);
    const priceSelect = screen.getByTestId("select-plan-standard-retail");
    expect(priceSelect).toBeInTheDocument();
    fireEvent.click(priceSelect);
    const priceSelect1 = screen.getByTestId("select-plan-plusImax-retail");
    fireEvent.click(priceSelect1);
    const retailAccordion = screen.getByTestId("tag-retail");
    fireEvent.click(retailAccordion);
    expect(retailAccordion).toBeInTheDocument();
  });

  it("To render pricing skeleton", async () => {
    renderComponent();
    const selectBox = screen.getByTestId(clusterTypeId);
    fireEvent.mouseDown(selectBox);

    const featureSelect = screen.getByLabelText(/Cluster Type/i);
    fireEvent.mouseDown(featureSelect);
    const options = await screen.findAllByRole("option");

    fireEvent.click(options[0]);

    const tagAccordion = screen.getByTestId("tag-cpq");
    const accordionParent = screen.getByTestId("accordion-cpq");
    mockUseLazyGetPlansForTenantQuery({
      isFetching: true,
      isError: false,
      data: standardPlanData,
    });
    fireEvent.click(tagAccordion);
    const pricingLoader = within(accordionParent).getByTestId("pricing-loader");
    expect(pricingLoader).toBeInTheDocument();
  });
});
