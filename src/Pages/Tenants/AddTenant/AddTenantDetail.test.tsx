import { fireEvent, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithStore } from "Tests/utils/renderWithStore";
import { Formik } from "formik";
import * as notistack from "notistack";
import { vi } from "vitest";
import AddTenantDetails from "./AddTenantDetail";
import { initialAddTenantValues } from "./addTenantsUtils";

const mockCountryCodes = [{ code: "+91", label: "India" }];

vi.mock("./utils", () => ({
  countryCodes: mockCountryCodes,
}));

describe("AddTenantDetails", () => {
  const renderComponent = (initialValues = {}) => {
    return renderWithStore(
      <Formik initialValues={initialAddTenantValues} onSubmit={() => {}}>
        <AddTenantDetails />
      </Formik>
    );
  };

  const mockEnqueueSnackbar = vi.fn();
  // Mock notistack
  vi.spyOn(notistack, "useSnackbar").mockReturnValue({
    enqueueSnackbar: mockEnqueueSnackbar,
    closeSnackbar: vi.fn(),
  });
  it("should render all form fields correctly", () => {
    renderComponent();

    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/company/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/designation/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/mobile number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/language/i)).toHaveAttribute("readonly");
    expect(screen.getByLabelText(/Subdomain/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/tier/i)).toHaveAttribute("readonly");
  });

  it("should allow user to type into text inputs", async () => {
    renderComponent();

    const firstNameInput = screen.getByLabelText(/first name/i);
    await userEvent.type(firstNameInput, "John");
    expect(firstNameInput).toHaveValue("John");

    const lastNameInput = screen.getByLabelText(/last name/i);
    await userEvent.type(lastNameInput, "Doe");
    expect(lastNameInput).toHaveValue("Doe");

    const mobileNumberInput = screen.getByLabelText(
      /mobile number/i
    ) as HTMLInputElement; // Ensure it's an input element
    await userEvent.type(mobileNumberInput, "123456");
    expect(mobileNumberInput).toHaveValue("123456");

    await userEvent.type(mobileNumberInput, "abc");
    expect(mobileNumberInput).toHaveValue("123456"); // Value remains unchanged

    const pastedValue = "abc";
    mobileNumberInput.value = pastedValue;

    fireEvent.input(mobileNumberInput);

    expect(mobileNumberInput).toHaveValue("");
  });

  it("should trigger onBlur event for inputs", async () => {
    renderComponent();
    const emailInput = screen.getByLabelText(/email/i);
    await userEvent.click(emailInput);
    await userEvent.tab();
    expect(emailInput).not.toHaveFocus();
  });
});
