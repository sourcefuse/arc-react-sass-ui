import { fireEvent, screen } from "@testing-library/react";
import { vi } from "vitest";
import { TablePagination } from "./PaginationComponent";
import { renderWithStore } from "Tests/utils/renderWithStore";
import { PermissionsEnum } from "Constants/enums";

const mockSetOffset = vi.fn();
const mockSetLimit = vi.fn();

vi.mock("redux/app/adminSettingsApiSlice", async (importOriginal) => {
  const originalModule = await importOriginal<
    typeof import("redux/app/adminSettingsApiSlice")
  >();

  return {
    ...originalModule,
    useGetAdminSettingsQuery: () => ({
      data: [],
      isError: false,
      isLoading: false,
    }),
  };
});

describe("TablePagination Component", () => {
  const renderComponent = (props = {}, rowsPerListing = 15) =>
    renderWithStore(
      <TablePagination
        count={100}
        offset={0}
        limit={10}
        setOffset={mockSetOffset}
        setLimit={mockSetLimit}
        manualPagination={true}
        {...props}
      />,
      {
        preloadedState: {
          auth: { permissions: Object.values(PermissionsEnum) },
          api: {
            queries: {
              "getAdminSettings()": {
                data: { rowsPerListing },
                status: "fulfilled",
              },
            },
          },
        },
      }
    );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders pagination controls", () => {
    renderComponent();
    const nextPageButton = screen.getByRole("button", {
      name: /Go to next page/i,
    });
    expect(nextPageButton).toBeInTheDocument();
  });

  it("calculates and displays the correct page number", () => {
    renderComponent({ offset: 20, limit: 10 });
    expect(screen.getByDisplayValue("3")).toBeInTheDocument();
  });

  it("calls setOffset when a different page is selected", () => {
    renderComponent();
    fireEvent.click(screen.getByRole("button", { name: /2/i }));
    expect(mockSetOffset).toHaveBeenCalledWith(10);
  });

  it("handles direct page input", () => {
    renderComponent();
    const input = screen.getByLabelText("Go to Page :");
    fireEvent.change(input, { target: { value: "3" } });
    expect(mockSetOffset).toHaveBeenCalledWith(20);
  });

  it("prevents page input below 1", () => {
    renderComponent();
    const input = screen.getByLabelText("Go to Page :");
    fireEvent.change(input, { target: { value: "0" } });
    expect(mockSetOffset).toHaveBeenCalledWith(0);
  });

  it("renders rows per page select with correct default value", () => {
    renderComponent();
    expect(screen.getByDisplayValue("10")).toBeInTheDocument();
  });
});
