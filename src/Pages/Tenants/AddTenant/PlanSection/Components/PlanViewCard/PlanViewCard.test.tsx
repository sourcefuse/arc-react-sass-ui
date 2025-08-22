import { render, screen } from "@testing-library/react";
import { PlanSelectedType } from "../../../addTenantsUtils";
import PlanViewCard from "./PlanViewCard";

describe("PlanViewCard", () => {
  it("should render nothing if plan is undefined", () => {
    render(<PlanViewCard plan={undefined} />);
    expect(screen.queryByTestId("plan-view-card")).not.toBeInTheDocument();
  });

  it("should render plan details correctly", () => {
    const plan: PlanSelectedType = {
      name: "Basic Plan",
      amount: 10,
      duration: "1 month",
      tagId: "basic-plan-tag",
      planId: "basic-plan-id",
      billingCycleId: "basic-plan-billing-cycle-id",
    };

    render(<PlanViewCard plan={plan} />);

    expect(screen.getByText("Basic Plan")).toBeInTheDocument();
    expect(screen.getByText("$10")).toBeInTheDocument();
    expect(screen.getByText("1 month")).toBeInTheDocument();
  });
});
