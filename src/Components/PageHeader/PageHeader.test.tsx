import { render, screen } from "@testing-library/react";
import PageHeader from "./PageHeader";

describe("PageHeader Component", () => {
  it("renders the page name", () => {
    render(<PageHeader pageName="Test Page" />);
    expect(screen.getByText(/Test Page/i)).toBeInTheDocument();
  });

  it("renders children components", () => {
    render(
      <PageHeader pageName="Test Page">
        <div data-testid="child">Child Component</div>
      </PageHeader>
    );
    expect(screen.getByTestId("child")).toBeInTheDocument();
  });
});
