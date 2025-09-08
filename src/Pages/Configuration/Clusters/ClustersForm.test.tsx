/* eslint-disable testing-library/no-wait-for-multiple-assertions */
/* eslint-disable sonarjs/no-duplicate-string */
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ClustersForm from "./ClustersForm";
import { Formik } from "formik";
import { vi } from "vitest";
import * as formik from "formik";
const initialValues = {
  id: "",
  label: "",
  region: "",
  zone: "",
  description: "",
  clusterTypeDescription: "",
  clusterTypeId: "",
};
describe("ClustersForm Component", () => {
  const mockClusterData = [
    {
      id: "1",
      label: "Cluster 1",
      region: "us-east-1",
      zone: "zone-a",
      description: "Test Cluster 1",
      clusterTypeDescription: "Description 1",
      clusterTypeId: "type-1",
    },
    {
      id: "2",
      label: "Cluster 2",
      region: "us-west-1",
      zone: "zone-b",
      description: "Test Cluster 2",
      clusterTypeDescription: "Description 2",
      clusterTypeId: "type-2",
    },
  ];
  const mockValidateForm = vi.fn();
  const mockSetFieldValue = vi.fn();
  const mockResetForm = vi.fn();
  const mockSetTouched = vi.fn();

  const renderComponent = (isClusterLoading = false) => {
    render(
      <Formik initialValues={initialValues} onSubmit={vi.fn()}>
        <ClustersForm
          clusterData={mockClusterData}
          isClusterLoading={isClusterLoading}
        />
      </Formik>
    );
  };

  it("renders all form fields", async () => {
    renderComponent(false); // Ensure isClusterLoading is false
    await waitFor(() => {
      expect(
        screen.getByLabelText(/Cluster Type Description/i)
      ).toBeInTheDocument();
      expect(screen.getByLabelText(/Region/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Cluster Zone/i)).toBeInTheDocument();
      expect(
        screen.getByRole("textbox", { name: /^Description$/i })
      ).toBeInTheDocument();
    });
  });

  it("renders the loader when isClusterLoading is true", () => {
    renderComponent(true);
    expect(screen.getByTestId("page-loader")).toBeInTheDocument();
  });

  it("handles AutoCompleteSelect changes and updates form fields", async () => {
    renderComponent();
    const autocompleteInput = screen.getByRole("combobox");

    // Simulate selecting a cluster
    fireEvent.change(autocompleteInput, { target: { value: "Cluster 1" } });
    const option = await screen.findByText("Cluster 1");
    fireEvent.click(option);

    await waitFor(() => {
      expect(screen.getByDisplayValue("us-east-1")).toBeInTheDocument();
      expect(screen.getByDisplayValue("zone-a")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Test Cluster 1")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Description 1")).toBeInTheDocument();
    });
  });

  it("resets the form when the clear reason is triggered", async () => {
    renderComponent();
    const autocompleteInput = screen.getByRole("combobox");

    // Simulate clearing the input
    fireEvent.change(autocompleteInput, { target: { value: "" } });
    fireEvent.keyDown(autocompleteInput, { key: "Escape" });

    await waitFor(() => {
      expect(screen.queryByDisplayValue("us-east-1")).not.toBeInTheDocument();
      expect(screen.queryByDisplayValue("zone-a")).not.toBeInTheDocument();
      expect(
        screen.queryByDisplayValue("Test Cluster 1")
      ).not.toBeInTheDocument();
      expect(
        screen.queryByDisplayValue("Description 1")
      ).not.toBeInTheDocument();
    });
  });

  it("validates the form when a cluster is selected", async () => {
    // Mock useFormikContext
    vi.spyOn(formik, "useFormikContext").mockReturnValue({
      validateForm: mockValidateForm,
      setFieldValue: mockSetFieldValue,
      resetForm: mockResetForm,
      setTouched: mockSetTouched,
      setStatus: vi.fn(),
      setErrors: vi.fn(),
      setSubmitting: vi.fn(),
      setValues: vi.fn(),
      values: initialValues,
      errors: {},
      touched: {},
      isSubmitting: false,
      isValidating: false,
      submitCount: 0,
      handleBlur: vi.fn(),
      handleChange: vi.fn(),
      handleReset: vi.fn(),
      handleSubmit: vi.fn(),
      initialErrors: {},
      initialTouched: {},
      initialValues,
      isValid: true,
      dirty: false,
      status: null,
      setFieldError: function (
        field: string,
        message: string | undefined
      ): void {
        throw new Error("Function not implemented.");
      },
      setFieldTouched: function (
        field: string,
        isTouched?: boolean,
        shouldValidate?: boolean
      ): Promise<void | formik.FormikErrors<unknown>> {
        throw new Error("Function not implemented.");
      },
      validateField: function (
        field: string
      ): Promise<void> | Promise<string | undefined> {
        throw new Error("Function not implemented.");
      },
      submitForm: () => Promise.resolve(),
      setFormikState: function (
        f:
          | formik.FormikState<unknown>
          | ((
              prevState: formik.FormikState<unknown>
            ) => formik.FormikState<unknown>),
        cb?: () => void
      ): void {
        throw new Error("Function not implemented.");
      },
      getFieldProps: function <Value = any>(
        props: string | formik.FieldConfig<Value>
      ): formik.FieldInputProps<Value> {
        throw new Error("Function not implemented.");
      },
      getFieldMeta: function <Value>(
        name: string
      ): formik.FieldMetaProps<Value> {
        throw new Error("Function not implemented.");
      },
      getFieldHelpers: function <Value = any>(
        name: string
      ): formik.FieldHelperProps<Value> {
        throw new Error("Function not implemented.");
      },
      registerField: function (
        name: string,
        fns: { validate?: formik.FieldValidator }
      ): void {
        throw new Error("Function not implemented.");
      },
      unregisterField: function (name: string): void {
        throw new Error("Function not implemented.");
      },
    });

    renderComponent();
    const autocompleteInput = screen.getByRole("combobox");

    // Simulate selecting a cluster
    fireEvent.change(autocompleteInput, { target: { value: "Cluster 2" } });
    const option = await screen.findByText("Cluster 2");
    fireEvent.click(option);

    await waitFor(() => {
      expect(mockValidateForm).toHaveBeenCalled();
    });
  });
});
