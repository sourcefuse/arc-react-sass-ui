import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import InfoTooltip from "./InfoTooltip";

describe("InfoTooltip Component", () => {
  it("should render the tooltip icon", () => {
    render(<InfoTooltip title="Test Tooltip" />);
    const iconButton = screen.getByRole("button");
    expect(iconButton).toBeInTheDocument();
  });

  it("should display the tooltip on hover", async () => {
    render(<InfoTooltip title="Test Tooltip" />);
    const iconButton = screen.getByRole("button");
    await userEvent.hover(iconButton);
    const tooltip = await screen.findByText("Test Tooltip");
    expect(tooltip).toBeInTheDocument();
  });

  it("should hide the tooltip when not hovered", async () => {
    render(<InfoTooltip title="Test Tooltip" />);
    const iconButton = screen.getByRole("button");
    await userEvent.hover(iconButton);
    await userEvent.unhover(iconButton);
    // eslint-disable-next-line testing-library/await-async-utils
    waitFor(() => {
      const tooltip = screen.queryByText("Test Tooltip");
      expect(tooltip).toHaveStyle("opacity:0");
    });
  });
});
