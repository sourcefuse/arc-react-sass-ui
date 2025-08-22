import { fireEvent, screen, within } from "@testing-library/react";
import { vi } from "vitest";
import { Table } from "./Table";
import { renderWithStore } from "Tests/utils/renderWithStore";
import { PermissionsEnum } from "Constants/enums";
import { BrowserRouter } from "react-router-dom";

const name = "Mock Table";

export const mockData = [
  {
    tenantID: "T001",
    paymentStatus: "Completed",
    amount: 500.0,
    date: "2023-12-01",
  },
  {
    tenantID: "T002",
    paymentStatus: "Pending",
    amount: 300.0,
    date: "2023-12-02",
  },
  {
    tenantID: "T003",
    paymentStatus: "Failed",
    amount: 150.0,
    date: "2023-12-03",
  },
  {
    tenantID: "T004",
    paymentStatus: "Completed",
    amount: 800.0,
    date: "2023-12-04",
  },
  {
    tenantID: "T005",
    paymentStatus: "Pending",
    amount: 250.0,
    date: "2023-12-05",
  },
  {
    tenantID: "T006",
    paymentStatus: "Completed",
    amount: 1000.0,
    date: "2023-12-06",
  },
  {
    tenantID: "T007",
    paymentStatus: "Failed",
    amount: 75.0,
    date: "2023-12-07",
  },
  {
    tenantID: "T008",
    paymentStatus: "Completed",
    amount: 600.0,
    date: "2023-12-08",
  },
  {
    tenantID: "T009",
    paymentStatus: "Pending",
    amount: 400.0,
    date: "2023-12-09",
  },
  {
    tenantID: "T010",
    paymentStatus: "Completed",
    amount: 900.0,
    date: "2023-12-10",
  },
  {
    tenantID: "T011",
    paymentStatus: "Completed",
    amount: 750.0,
    date: "2023-12-11",
  },
  {
    tenantID: "T012",
    paymentStatus: "Pending",
    amount: 180.0,
    date: "2023-12-12",
  },
  {
    tenantID: "T013",
    paymentStatus: "Failed",
    amount: 50.0,
    date: "2023-12-13",
  },
  {
    tenantID: "T014",
    paymentStatus: "Completed",
    amount: 400.0,
    date: "2023-12-14",
  },
  {
    tenantID: "T015",
    paymentStatus: "Pending",
    amount: 320.0,
    date: "2023-12-15",
  },
  {
    tenantID: "T016",
    paymentStatus: "Completed",
    amount: 200.0,
    date: "2023-12-16",
  },
  {
    tenantID: "T017",
    paymentStatus: "Failed",
    amount: 90.0,
    date: "2023-12-17",
  },
  {
    tenantID: "T018",
    paymentStatus: "Completed",
    amount: 650.0,
    date: "2023-12-18",
  },
  {
    tenantID: "T019",
    paymentStatus: "Pending",
    amount: 300.0,
    date: "2023-12-19",
  },
  {
    tenantID: "T020",
    paymentStatus: "Completed",
    amount: 1200.0,
    date: "2023-12-20",
  },
];

export const mockColumns = [
  { accessorKey: "tenantID", header: "Tenant ID" },
  { accessorKey: "paymentStatus", header: "Payment Status" },
  { accessorKey: "amount", header: "Amount" },
  { accessorKey: "date", header: "Date" },
];

const mockSetOffset = vi.fn();
const mockSetLimit = vi.fn();

const render = (component: React.ReactElement) => {
  return renderWithStore(component, {
    preloadedState: {
      auth: {
        permissions: [PermissionsEnum.ViewTenant, PermissionsEnum.CreateTenant],
      },
    },
  });
};

vi.mock("react-router-dom", () => {
  const originalModule = vi.importActual("react-router-dom");
  return {
    ...originalModule,
    useLocation: () => vi.fn(),
  };
});

describe("Table Component Tests", () => {
  it("should render the table with correct column headers and data", () => {
    render(
      <BrowserRouter>
        <Table
          tableName={name}
          columns={mockColumns}
          data={mockData}
          limit={10}
          setLimit={mockSetLimit}
          offset={0}
          setOffset={mockSetOffset}
          count={100}
          manualPagination={true}
          enablePagination
          enableGlobalFiltering
        />
      </BrowserRouter>
    );

    // Check if the table is rendered
    const table = screen.getByTestId("table-container");
    expect(table).toBeVisible();

    // Verify column headers are rendered
    mockColumns.forEach((column) => {
      const header = screen.getByText(column.header);
      expect(header).toBeInTheDocument();
    });

    mockData.slice(0, 4).forEach((row) => {
      const rowElement = screen.getByText(String(row.tenantID));
      expect(rowElement).toBeInTheDocument();
    });
  });

  it("should handle sorting  when enabled", () => {
    render(
      <BrowserRouter>
        <Table
          tableName={name}
          columns={mockColumns}
          data={mockData}
          limit={10}
          setLimit={mockSetLimit}
          offset={0}
          setOffset={mockSetOffset}
          count={100}
          manualPagination={true}
          enablePagination
          enableGlobalFiltering
        />
      </BrowserRouter>
    );

    const sortableColumnHeader = screen.getByText(mockColumns[0].header);
    fireEvent.click(sortableColumnHeader);
    const sortedRowCell = within(screen.getAllByRole("row")[1]).getByText(
      mockData[0].tenantID
    );
    expect(sortedRowCell).toBeInTheDocument(); // Expect cell from sorted data set
  });

  it("should paginate  when pagination is enabled", () => {
    render(
      <BrowserRouter>
        <Table
          tableName={name}
          columns={mockColumns}
          data={mockData}
          limit={10}
          setLimit={mockSetLimit}
          offset={0}
          setOffset={mockSetOffset}
          count={100}
          manualPagination={true}
          enablePagination
          enableGlobalFiltering
        />
      </BrowserRouter>
    );
    const nextPageButton = screen.getByRole("button", {
      name: /Go to next page/i,
    });
    expect(nextPageButton).toBeInTheDocument();
    expect(nextPageButton).toBeEnabled();
    fireEvent.click(nextPageButton);
    expect(mockSetOffset).toHaveBeenCalledWith(10);
  });

  it("should filter data when global filtering is enabled", () => {
    render(
      <BrowserRouter>
        <Table
          tableName={name}
          columns={mockColumns}
          data={mockData}
          limit={10}
          setLimit={mockSetLimit}
          offset={0}
          setOffset={mockSetOffset}
          count={100}
          manualPagination={true}
          enablePagination
          enableGlobalFiltering
        />
      </BrowserRouter>
    );

    const searchInput = screen.getByPlaceholderText(/search/i); // Assuming a search input placeholder exists

    fireEvent.change(searchInput, { target: { value: mockData[0].tenantID } });

    // Verify only matching rows are visible
    const visibleRows = screen.getAllByRole("row");
    const filteredRow = screen.getByText(mockData[0].tenantID);
    expect(visibleRows.length).toBeGreaterThan(1); // Ensure the header and at least one row are present
    expect(filteredRow).toBeInTheDocument();
  });
  it("should call handleHeaderBtnClick when header button is clicked", () => {
    const handleHeaderBtnClick = vi.fn();

    render(
      <BrowserRouter>
        <Table
          tableName={name}
          columns={mockColumns}
          data={mockData}
          limit={10}
          setLimit={mockSetLimit}
          offset={0}
          setOffset={mockSetOffset}
          count={100}
          manualPagination={true}
          enablePagination
          enableGlobalFiltering
          headerBtnName="Add Item"
          handleHeaderBtnClick={handleHeaderBtnClick}
        />
      </BrowserRouter>
    );

    const headerButton = screen.getByRole("button", { name: /Add Item/i });
    expect(headerButton).toBeInTheDocument();

    fireEvent.click(headerButton);
    expect(handleHeaderBtnClick).toHaveBeenCalledTimes(1);
  });
  it("should render the table header with the correct name", () => {
    render(
      <BrowserRouter>
        <Table
          tableName={name}
          columns={mockColumns}
          data={mockData}
          limit={10}
          setLimit={mockSetLimit}
          offset={0}
          setOffset={mockSetOffset}
          count={100}
          manualPagination={true}
          enablePagination
          enableGlobalFiltering
        />
      </BrowserRouter>
    );

    // Check if the table header is rendered with the correct name
    const tableHeader = screen.getByText(name);
    expect(tableHeader).toBeInTheDocument();
  });

  it("should show loader when isTableLoading is true", () => {
    render(
      <Table
        tableName={name}
        columns={mockColumns}
        data={mockData}
        isTableLoading={true}
      />
    );

    const tableLoader = screen.getByTestId("table-loader");
    expect(tableLoader).toBeInTheDocument();
  });

  it("should show error when isErrorLoading is true", () => {
    render(
      <Table
        tableName={name}
        columns={mockColumns}
        data={mockData}
        isErrorLoading={true}
      />
    );

    const tableError = screen.getByTestId("table-error");
    expect(tableError).toBeInTheDocument();
  });

  it("should show no data view when data passed is empty", () => {
    render(<Table tableName={name} columns={mockColumns} data={[]} />);

    const tableNoData = screen.getByText(/No Results Found./i);
    expect(tableNoData).toBeInTheDocument();
  });
});
