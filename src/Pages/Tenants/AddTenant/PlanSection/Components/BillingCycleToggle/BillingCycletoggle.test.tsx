import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import BillingCycleToggle from "./BillingCycleToggle"; // Adjust the import path as needed

describe("BillingCycleToggle", () => {
  const handleBillingChange = vi.fn();

  const billingData = [
    {
      id: "1",
      cycleName: "Monthly",
      duration: 1,
      durationUnit: "month",
      description: "",
      deleted: false,
      deletedOn: "",
      deletedBy: "",
      createdOn: new Date().toISOString(),
      modifiedOn: new Date().toISOString(),
      createdBy: "system",
      modifiedBy: "system",
    },
    {
      id: "2",
      cycleName: "Yearly",
      duration: 12,
      durationUnit: "month",
      description: "",
      deleted: false,
      deletedOn: "",
      deletedBy: "",
      createdOn: new Date().toISOString(),
      modifiedOn: new Date().toISOString(),
      createdBy: "system",
      modifiedBy: "system",
    },
  ];

  const renderComponent = (billingCycle: string) => {
    render(
      <BillingCycleToggle
        billingCycle={billingCycle}
        handleBillingChange={handleBillingChange}
        tagId="test-tag"
        billingData={billingData}
      />
    );
  };

  it("should render Monthly and Yearly toggle buttons", () => {
    renderComponent("monthly");
    expect(screen.getByText("Monthly")).toBeInTheDocument();
    expect(screen.getByText("Yearly")).toBeInTheDocument();
  });

  it("should call handleBillingChange when toggle button is clicked", () => {
    renderComponent("monthly");
    const yearlyButton = screen.getByText("Yearly");
    fireEvent.click(yearlyButton);
    expect(handleBillingChange).toHaveBeenCalledWith("yearly", "test-tag");
  });
});
