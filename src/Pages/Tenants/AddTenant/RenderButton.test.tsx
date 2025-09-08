import { fireEvent, render, screen } from "@testing-library/react";
import { Formik } from "formik";
import { describe, expect, it, vi } from "vitest";
import RenderButton from "./RenderButton";

describe("RenderButton Component", () => {
  const handleCancelMock = vi.fn();
  const handleBackMock = vi.fn();
  const handleNextMock = vi.fn();

  const renderComponent = (
    activeStep: number,
    isValid: boolean = true,
    dirty: boolean = true
  ) => {
    return render(
      <Formik
        initialValues={{
          firstName: "Frank",
          lastName: "Dude",
          company: "test",
          designation: "LEAD",
          email: "support@abc.com",
          countryCode: { code: "+91", label: "India" },
          mobileNumber: "121221121",
          language: "English",
          billingCycle: "Monthly",
          planVariant: "12",
          planType: "2112",
        }}
        onSubmit={() => {}}
      >
        <RenderButton
          handleCancel={handleCancelMock}
          handleBack={handleBackMock}
          handleNext={handleNextMock}
          activeStep={activeStep}
        />
      </Formik>
    );
  };

  it("renders cancel, back, and next buttons correctly", () => {
    renderComponent(1); // Active step is 1

    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /back/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /next/i })).toBeInTheDocument();
  });
  it("calls handleCancel when cancel button is clicked", () => {
    renderComponent(0);

    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    fireEvent.click(cancelButton);

    expect(handleCancelMock).toHaveBeenCalledTimes(1);
  });
  it("calls handleBack when back button is clicked", () => {
    renderComponent(1); // Step 1, so back button should be visible

    const backButton = screen.getByRole("button", { name: /back/i });
    fireEvent.click(backButton);

    expect(handleBackMock).toHaveBeenCalledTimes(1);
  });
  it("disables next button when form is invalid", () => {
    renderComponent(0, false, false); // isValid = false, dirty = false

    const nextButton = screen.getByRole("button", { name: /next/i });
    expect(nextButton).toBeDisabled();
  });
});
