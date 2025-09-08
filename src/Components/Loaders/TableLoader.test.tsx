import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import TableLoader from "./TableLoader";

describe("TableLoader", () => {
  it("renders without crashing", () => {
    render(<TableLoader />);

    const loader = screen.getByTestId("skeleton-loader");
    expect(loader).toBeInTheDocument();
  });

  it("renders header when hasHeader is true", () => {
    render(<TableLoader hasHeader={true} />);

    const headerLoader = screen.getByTestId("skeleton-header");
    expect(headerLoader).toBeInTheDocument();
  });
});
