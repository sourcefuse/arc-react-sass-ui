import { render, screen } from "@testing-library/react";
import PageLoader from "./PageLoader";

describe("PageLoader Component", () => {
  it("renders the correct number of skeleton fields", () => {
    const fieldCount = 4;
    render(<PageLoader fieldCount={fieldCount} />);

    // Check that the correct number of skeleton fields are rendered
    const skeletons = screen.getByTestId("page-loader");
    expect(skeletons).toBeInTheDocument();
  });

  it("renders buttons when showButtons is true", () => {
    render(<PageLoader fieldCount={4} showButtons={true} />);

    // Check that the buttons are rendered
    const buttons = screen.getByTestId("page-loader");
    expect(buttons).toBeInTheDocument();
  });

  it("does not render buttons when showButtons is false", () => {
    render(<PageLoader fieldCount={4} showButtons={false} />);

    // Check that the buttons are not rendered
    const buttons = screen.queryByTestId("button-skeleton");
    expect(buttons).not.toBeInTheDocument();
  });
});
