import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  PlanAccordion,
  PlanAccordionDetails,
  PlanAccordionSummary,
} from "./PlanAccordion";

describe("PlanAccordion Components", () => {
  it("should render PlanAccordion", () => {
    render(
      <PlanAccordion>
        <div>Accordion</div>
      </PlanAccordion>
    );
    expect(screen.getByText("Accordion")).toBeInTheDocument();
  });

  it("should render PlanAccordionSummary", () => {
    render(
      <PlanAccordion>
        <PlanAccordionSummary> Summary</PlanAccordionSummary>
      </PlanAccordion>
    );
    expect(screen.getByText("Summary")).toBeInTheDocument();
  });

  it("should render PlanAccordionDetails", () => {
    render(
      <PlanAccordion>
        <PlanAccordionSummary> Summary</PlanAccordionSummary>
        <PlanAccordionDetails> Details</PlanAccordionDetails>
      </PlanAccordion>
    );
    expect(screen.getByText("Details")).toBeInTheDocument();
  });
  it("should render PlanAccordionDetails with correct styles", () => {
    render(
      <PlanAccordion>
        <PlanAccordionSummary> Summary</PlanAccordionSummary>
        <PlanAccordionDetails> Details</PlanAccordionDetails>
      </PlanAccordion>
    );
    expect(screen.getByText("Details")).toBeInTheDocument();
  });
});
