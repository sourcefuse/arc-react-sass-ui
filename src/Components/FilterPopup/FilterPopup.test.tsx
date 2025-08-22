import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { FilterConfig } from "./Filter.utils";
import FilterPopup from "./FilterPopup";
import { vi } from "vitest";
import { colors } from "Providers/theme/colors";
import { BrowserRouter } from "react-router-dom";

vi.mock("react-router-dom", () => {
  const originalModule = vi.importActual("react-router-dom");
  return {
    ...originalModule,
    useNavigate: () => vi.fn(),
  };
});

describe("FilterPopup Component", () => {
  const mockSetFilterPopFilter = vi.fn();
  const mockFilterConfig: FilterConfig = {
    status: {
      label: "Status",
      options: [
        { label: "Active", value: "active" },
        { label: "Inactive", value: "inactive" },
      ],
    },
    date: {
      label: "Date",
      options: [
        { label: "Last Week", value: "LastWeek" },
        { label: "Last Month", value: "LastMonth" },
        { label: "Custom", value: "Custom" },
      ],
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = () =>
    render(
      <BrowserRouter>
        <FilterPopup
          setFilterPopFilter={mockSetFilterPopFilter}
          filterConfig={mockFilterConfig}
        />
      </BrowserRouter>
    );
  it("renders the filter icon button", () => {
    renderComponent();

    expect(screen.getByAltText("open filter")).toBeInTheDocument();
  });

  it("opens popover when filter icon is clicked", async () => {
    renderComponent();

    const filterButton = screen.getByRole("button");
    fireEvent.click(filterButton);

    expect(screen.getByTestId("filter-component")).toBeInTheDocument();
    expect(screen.getByText("Filter")).toBeInTheDocument();
  });

  it("displays all filter categories and options", () => {
    renderComponent();

    const filterButton = screen.getByRole("button");
    fireEvent.click(filterButton);

    // Check if categories are rendered
    expect(screen.getByText("Status")).toBeInTheDocument();
    expect(screen.getByText("Date")).toBeInTheDocument();

    // Check if options are rendered
    expect(screen.getByText("Active")).toBeInTheDocument();
    expect(screen.getByText("Inactive")).toBeInTheDocument();
    expect(screen.getByText("Last Week")).toBeInTheDocument();
    expect(screen.getByText("Last Month")).toBeInTheDocument();
    expect(screen.getByText("Custom")).toBeInTheDocument();
  });

  it("toggles filter selection when clicking on filter chips", async () => {
    renderComponent();

    const filterButton = screen.getByRole("button");
    fireEvent.click(filterButton);

    const activeChip = screen.getByText("Active");
    fireEvent.click(activeChip);

    // Check if the chip style changes on selection
    // eslint-disable-next-line testing-library/no-node-access
    expect(activeChip.parentElement).toHaveStyle({
      backgroundColor: colors.selectFilter,
    });

    // Click again to deselect
    fireEvent.click(activeChip);
    // eslint-disable-next-line testing-library/no-node-access
    expect(activeChip.parentElement).not.toHaveStyle({
      backgroundColor: colors.selectFilter,
    });
  });

  it("calls setFilterPopFilter with correct filters when Apply is clicked", async () => {
    renderComponent();

    const filterButton = screen.getByRole("button");
    fireEvent.click(filterButton);

    // Select a status filter
    const activeChip = screen.getByText("Active");
    fireEvent.click(activeChip);

    // Click Apply
    const applyButton = screen.getByText("Apply");
    fireEvent.click(applyButton);

    expect(mockSetFilterPopFilter).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "active",
        date: null,
      })
    );
  });

  it("closes popover when Cancel is clicked", async () => {
    renderComponent();

    const filterButton = screen.getByRole("button");
    fireEvent.click(filterButton);

    const cancelButton = screen.getByTestId("close-filter-btn");
    fireEvent.click(cancelButton);

    await waitFor(() => {
      expect(screen.queryByTestId("filter-component")).not.toBeInTheDocument();
    });
  });

  it("shows dot indicator when filters are applied", async () => {
    renderComponent();

    const filterButton = screen.getByRole("button");
    fireEvent.click(filterButton);

    // Select a filter
    const activeChip = screen.getByText("Active");
    fireEvent.click(activeChip);

    // Click Apply
    const applyButton = screen.getByText("Apply");
    fireEvent.click(applyButton);

    // Check if the red dot indicator is present
    // eslint-disable-next-line testing-library/no-node-access
    const indicator = screen.getByRole("button").querySelector("div");
    expect(indicator).toHaveStyle({
      backgroundColor: colors.selectFilter,
    });
  });
});
