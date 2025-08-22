import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import BillingCyclesForm from "./BillingCyclesForm";
import { Formik } from "formik";
import { vi } from "vitest";

describe("BillingCyclesForm Component", () => {
  const mockBillingCycleData = [
    {
      id: "1",
      cycleName: "Monthly",
      duration: 1,
      durationUnit: "MONTHLY",
      description: "Monthly billing cycle",
      deleted: false,
      deletedOn: null,
      deletedBy: null,
      createdOn: "2023-01-01T00:00:00Z",
      createdBy: "admin",
      updatedOn: "2023-01-02T00:00:00Z",
      updatedBy: "admin",
      modifiedOn: "2023-01-03T00:00:00Z",
      modifiedBy: "admin",
    },
  ];

  const renderComponent = (isBillingCycleLoading = false) => {
    render(
      <Formik
        initialValues={{
          id: "",
          cycleName: "",
          duration: 0,
          durationUnit: "",
          description: "",
        }}
        onSubmit={vi.fn()}
      >
        <BillingCyclesForm
          billingCycleData={mockBillingCycleData}
          isBillingCycleLoading={isBillingCycleLoading}
        />
      </Formik>
    );
  };

  it("renders all form fields", async () => {
    renderComponent(false);
    await waitFor(() => {
      expect(screen.getByLabelText(/Cycle Name/i)).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByLabelText(/Duration/i)).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
    });
  });

  it("renders the loader when isBillingCycleLoading is true", () => {
    renderComponent(true);
    expect(screen.getByTestId("page-loader")).toBeInTheDocument();
  });

  it("handles AutoCompleteSelect changes and updates form fields", async () => {
    renderComponent();
    const autocompleteInput = screen.getByRole("combobox");

    fireEvent.change(autocompleteInput, { target: { value: "Monthly" } });
    const option = await screen.findByText("Monthly");
    fireEvent.click(option);

    await waitFor(() => {
      expect(screen.getByDisplayValue("1")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(
        screen.getByDisplayValue("Monthly billing cycle")
      ).toBeInTheDocument();
    });
  });
});
