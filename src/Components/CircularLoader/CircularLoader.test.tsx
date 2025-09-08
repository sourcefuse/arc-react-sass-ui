import { render, screen } from "@testing-library/react";
import CircularLoader from "./CircularLoader";

describe("CircularLoader Component", () => {
  it("should render the CircularLoader component", () => {
    render(<CircularLoader />);
    const loader = screen.getByTestId("circular-progress");
    expect(loader).toBeInTheDocument();
  });
});
