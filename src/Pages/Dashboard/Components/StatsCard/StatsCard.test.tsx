import { render, screen } from "@testing-library/react";
import StatsCard from "./StatsCard";
import { describe, it, expect } from "vitest";

describe("StatsCard", () => {
  it("renders dataValue and dataLabel when not loading", () => {
    render(
      <StatsCard
        dataValue="123"
        dataLabel="Test Label"
        icon={<div>Icon</div>}
        iconBgColor="blue"
      />
    );

    expect(screen.getByText("123")).toBeInTheDocument();
    expect(screen.getByText("Test Label")).toBeInTheDocument();
  });

  it("renders skeleton when loading", () => {
    render(
      <StatsCard
        dataValue="123"
        dataLabel="Test Label"
        icon={<div>Icon</div>}
        iconBgColor="blue"
        isLoading={true}
      />
    );
    expect(screen.getByTestId("loader")).toBeInTheDocument();
  });

  it("renders icon with correct background color", () => {
    render(
      <StatsCard
        dataValue="123"
        dataLabel="Test Label"
        icon={<div>Icon</div>}
        iconBgColor="blue"
      />
    );

    // eslint-disable-next-line testing-library/no-node-access
    const iconContainer = screen.getByText("Icon").parentElement;
    expect(iconContainer).toHaveStyle("background-color: blue");
  });
});
