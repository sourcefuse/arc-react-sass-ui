import { render, screen, fireEvent } from "@testing-library/react";
import RenderButton from "./RenderButton";
import { Formik } from "formik";
import { vi } from "vitest";
import { PermissionsEnum } from "Constants/enums";
import * as permissionHook from "Hooks/usePermission";

describe("RenderButton Component", () => {
  const mockHandleCancel = vi.fn();
  const SUBMIT_BUTTON_TEST_ID = "submit-button";
  vi.spyOn(permissionHook, "usePermission").mockReturnValue(true);
  const defaultProps = {
    handleCancel: mockHandleCancel,
    showButtonLoader: false,
  };

  const renderComponent = (formikValues: any, props = {}) =>
    render(
      <Formik initialValues={formikValues} onSubmit={vi.fn()}>
        <RenderButton
          {...defaultProps}
          {...props}
          permissions={Object.values(PermissionsEnum)}
        />
      </Formik>
    );

  it("renders Cancel and Submit buttons", () => {
    renderComponent({ id: "123", name: "Test Item" });

    expect(screen.getByText("Cancel")).toBeInTheDocument();
    expect(screen.getByText("Update")).toBeInTheDocument();
  });

  it("calls handleCancel when Cancel button is clicked", () => {
    renderComponent({ id: "123", name: "Test Item" });

    const cancelButton = screen.getByText("Cancel");
    fireEvent.click(cancelButton);

    expect(mockHandleCancel).toHaveBeenCalled();
  });

  it("disables Submit button when form is invalid or not dirty", () => {
    renderComponent({ id: "123", name: "Test Item" });
    const submitButton = screen.getByTestId(SUBMIT_BUTTON_TEST_ID);
    expect(submitButton).toBeDisabled();
  });
});
