import PostAddOutlinedIcon from "@mui/icons-material/PostAddOutlined";
import {
  Box,
  Grid,
  Table as MuiTable,
  TableProps as MuiTableProps,
  Paper,
  TableBody,
  TableBodyProps,
  TableCellProps,
  TableContainer,
  TableContainerProps,
  TableFooter,
  TableFooterProps,
  TableHead,
  TableHeadProps,
  TablePaginationProps,
  TableRow,
  TableRowProps,
  Typography,
} from "@mui/material";
import {
  ColumnDef,
  ColumnFiltersState,
  FilterFn,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  Row,
  useReactTable,
} from "@tanstack/react-table";
import Button from "Components/Button";
import TableLoader from "Components/Loaders";
import PageHeader from "Components/PageHeader";
import React, {
  Dispatch,
  memo,
  SetStateAction,
  useMemo,
  useState,
} from "react";
import { FilterConfig } from "../FilterPopup/Filter.utils";
import { FilterPopupState } from "../FilterPopup/FilterPopup";
import { filterFns } from "../FilterPopup/FilterFunctions";
import {
  DefaultColumn,
  DefaultFullWidthRow,
  DefaultRow,
  GlobalFilter,
  useHandleLocalStorage,
} from "./helper";
import { TablePagination } from "./PaginationComponent";
import { PermissionsEnum } from "Constants/enums";
import { PermissionWrapper } from "Components/PermissionWrapper";
import ErrorView from "Components/Error/ErrorView";
import { DEFAULT_LIMIT, DEFAULT_OFFSET } from "Constants/helper";
import { useQueryHookWithPermission } from "Hooks/useQueryHookWithPermission";
import { useGetAdminSettingsQuery } from "redux/app/configurationApiSlice";
export interface AnyObject {
  [key: string]: any; // NOSONAR
}

export type MUITablePropsObject = {
  tableContainerProps?: TableContainerProps;
  tableProps?: MuiTableProps;
  tableHeadProps?: TableHeadProps;
  headerRowProps?: TableRowProps;
  tableBodyProps?: TableBodyProps;
  tableFooterProps?: TableFooterProps;
  tablePaginationProps?: TablePaginationProps;
  bodyRowProps?: TableRowProps;
  bodyCellProps?: TableCellProps;
  columnCellProps?: TableCellProps;
};

export interface TableProps<T> {
  tableName?: string;
  data: T[];
  columns: ColumnDef<T>[];
  limit?: number;
  setLimit?: (newLimit: number) => void;
  offset?: number;
  setOffset?: (newOffset: number) => void;
  count?: number;
  manualPagination?: boolean;
  enableSorting?: boolean;
  enableGlobalFiltering?: boolean;
  disableFilterPopup?: boolean;
  globalFilterFn?: FilterFn<T>;
  globalFilterPlaceholder?: string;
  enableColumnFiltering?: boolean;
  enablePagination?: boolean;
  tablePropsObject?: MUITablePropsObject;
  headerBtnName?: string;
  headerBtnPermissions?: PermissionsEnum[];
  headerBtnEndIcon?: React.ReactNode;
  headerBtnStartIcon?: React.ReactNode;
  handleHeaderBtnClick?: React.MouseEventHandler<HTMLButtonElement>;
  setFinalFilter?: (data: FilterPopupState | null) => void;
  setSearchFilter?: (data: string) => void;
  filterConfig?: FilterConfig;
  isTableLoading?: boolean;
  isErrorLoading?: boolean;
  noDataView?: React.ReactNode;
  handleRowClick?: (row: Row<T>) => void;
  handleSortColumnChange?: (sortBy: string | null) => void;
  showBackground?: boolean;
}

const renderLoadingState = () => (
  <Box data-testid="table-loader" marginInline={2}>
    <TableLoader />
  </Box>
);

const TableHeader: React.FC<{
  tableName?: string;
  showBackground?: boolean;
  enableGlobalFiltering?: boolean;
  globalFilter: string;
  setGlobalFilter: Dispatch<SetStateAction<string>>;
  globalFilterPlaceholder: string;
  setFinalFilter?: (data: FilterPopupState | null) => void;
  setSearchFilter?: (data: string) => void;
  filterConfig: FilterConfig;
  disableFilterPopup?: boolean;
  headerBtnName?: string;
  headerBtnPermissions?: PermissionsEnum[];
  headerBtnEndIcon?: React.ReactNode;
  handleHeaderBtnClick?: React.MouseEventHandler<HTMLButtonElement>;
}> = ({
  tableName,
  showBackground,
  enableGlobalFiltering,
  globalFilter,
  setGlobalFilter,
  globalFilterPlaceholder,
  setFinalFilter,
  setSearchFilter,
  filterConfig,
  disableFilterPopup,
  headerBtnName,
  headerBtnPermissions,
  headerBtnEndIcon,
  handleHeaderBtnClick,
}) => {
  if (!tableName) return null;

  return (
    <PageHeader pageName={tableName} showBackground={showBackground}>
      <Box display="flex" justifyContent="flex-end" alignItems="center">
        {enableGlobalFiltering && (
          <Grid item>
            <GlobalFilter
              globalFilter={globalFilter}
              setGlobalFilter={setGlobalFilter}
              globalFilterSearchPlaceholder={globalFilterPlaceholder}
              setFinalFilter={setFinalFilter}
              setSearchFilter={setSearchFilter}
              filterConfig={filterConfig}
              disableFilterPopup={disableFilterPopup}
            />
          </Grid>
        )}
        <PermissionWrapper requiredPermissions={headerBtnPermissions}>
          {headerBtnName && (
            <Grid item>
              <Button
                variant="outlined"
                sx={{
                  backgroundColor: "background.paper",
                  whiteSpace: "nowrap",
                  py: 1,
                  ml: 1,
                  "&:hover": { backgroundColor: "status.defaultPale" },
                }}
                startIcon={headerBtnEndIcon}
                onClick={handleHeaderBtnClick}
              >
                {headerBtnName}
              </Button>
            </Grid>
          )}
        </PermissionWrapper>
      </Box>
    </PageHeader>
  );
};

const TableContent: React.FC<{
  tablePropsObject?: MUITablePropsObject;
  headerGroups: any[];
  rows: Row<any>[];
  enableColumnFiltering?: boolean;
  enableSorting?: boolean;
  tableData: any[];
  noDataView?: React.ReactNode;
  handleRowClick?: (row: Row<any>) => void;
  table: any;
  manualPagination: boolean;
  count?: number;
  offset?: number;
  limit?: number;
  setOffset?: (offset: number) => void;
  setLimit?: (limit: number) => void;
  enablePagination?: boolean;
}> = ({
  tablePropsObject,
  headerGroups,
  rows,
  enableColumnFiltering,
  enableSorting,
  tableData,
  noDataView,
  handleRowClick,
  table,
  manualPagination,
  count,
  offset,
  limit,
  setOffset,
  setLimit,
  enablePagination,
}) => (
  <TableContainer
    data-testid="table-container"
    component={Paper}
    {...tablePropsObject?.tableContainerProps}
    sx={{
      borderRadius: "0.625rem",
      background: "background.paper",
      px: 2,
      ...tablePropsObject?.tableContainerProps?.sx,
    }}
  >
    <MuiTable {...tablePropsObject?.tableProps}>
      <TableHead {...tablePropsObject?.tableHeadProps}>
        {headerGroups.map((headerGroup) => (
          <TableRow
            key={headerGroup.id}
            sx={{ verticalAlign: "top" }}
            {...tablePropsObject?.headerRowProps}
          >
            {headerGroup.headers.map((header: any, index: number) => (
              <DefaultColumn
                key={header.id}
                header={header}
                index={index}
                enableColumnFiltering={enableColumnFiltering}
                enableSorting={enableSorting}
                columnCellProps={tablePropsObject?.columnCellProps}
              />
            ))}
          </TableRow>
        ))}
      </TableHead>
      <TableBody {...tablePropsObject?.tableBodyProps}>
        {!tableData.length ? (
          <DefaultFullWidthRow>
            <NoDataComponent noDataView={noDataView} />
          </DefaultFullWidthRow>
        ) : (
          rows.map((row, index) => (
            <DefaultRow
              key={row.id}
              row={row}
              index={index}
              bodyRowProps={tablePropsObject?.bodyRowProps}
              bodyCellProps={tablePropsObject?.bodyCellProps}
              onClick={() => handleRowClick?.(row)}
              isClickable={!!handleRowClick}
            />
          ))
        )}
      </TableBody>
      {enablePagination && (
        <TablePaginationSection
          tablePropsObject={tablePropsObject}
          table={table}
          manualPagination={manualPagination}
          count={count}
          offset={offset}
          limit={limit}
          setOffset={setOffset}
          setLimit={setLimit}
        />
      )}
    </MuiTable>
  </TableContainer>
);

const TablePaginationSection: React.FC<{
  tablePropsObject?: MUITablePropsObject;
  table: any;
  manualPagination: boolean;
  count?: number;
  offset?: number;
  limit?: number;
  setOffset?: (offset: number) => void;
  setLimit?: (limit: number) => void;
}> = ({
  tablePropsObject,
  table,
  manualPagination,
  count,
  offset,
  limit,
  setOffset,
  setLimit,
}) => (
  <TableFooter {...tablePropsObject?.tableFooterProps}>
    <DefaultFullWidthRow>
      <TablePagination
        manualPagination={manualPagination}
        count={
          manualPagination
            ? count ?? 0
            : table.getFilteredRowModel().rows.length
        }
        offset={offset}
        limit={limit}
        setOffset={setOffset}
        setLimit={setLimit}
        pageIndex={table.getState().pagination.pageIndex}
        rowsPerPage={table.getState().pagination.pageSize}
        onPageChange={(page) => table.setPageIndex(page)}
        onRowsPerPageChange={(size) => table.setPageSize(size)}
      />
    </DefaultFullWidthRow>
  </TableFooter>
);

const ARCTable = <T extends AnyObject>({
  tableName,
  data,
  columns,
  limit,
  setLimit,
  offset,
  setOffset,
  count,
  manualPagination = false,
  enableSorting,
  enableGlobalFiltering,
  disableFilterPopup,
  globalFilterFn = filterFns.fuzzy,
  globalFilterPlaceholder = "Search",
  enableColumnFiltering,
  enablePagination,
  tablePropsObject,
  headerBtnName,
  headerBtnEndIcon,
  headerBtnStartIcon,
  headerBtnPermissions,
  handleHeaderBtnClick,
  setFinalFilter,
  setSearchFilter,
  filterConfig = {},
  isTableLoading,
  isErrorLoading,
  noDataView,
  handleRowClick,
  handleSortColumnChange,
  showBackground,
}: TableProps<T>) => {
  const tableData = useMemo(() => data, [data]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const { handleSortingChange, sorting } = useHandleLocalStorage(
    handleSortColumnChange
  );
  const { data: adminSettings } = useQueryHookWithPermission(
    [PermissionsEnum.ViewAdminSettings],
    useGetAdminSettingsQuery,
    undefined,
    { skipToken: true }
  );

  const pageSize = adminSettings?.rowsPerListing ?? DEFAULT_LIMIT;

  const table = useReactTable({
    data: tableData,
    columns: columns.map((col) => ({
      ...col,
      sortDescFirst: false,
    })),
    state: {
      sorting,
      globalFilter,
      columnFilters,
    },
    initialState: {
      pagination: {
        pageIndex: DEFAULT_OFFSET,
        pageSize,
      },
    },
    manualPagination,
    globalFilterFn,
    manualSorting: true,
    onSortingChange: handleSortingChange,
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  if (isTableLoading) return renderLoadingState();
  if (isErrorLoading) return <ErrorView />;

  return (
    <Box data-testid="table">
      <TableHeader
        tableName={tableName}
        showBackground={showBackground}
        enableGlobalFiltering={enableGlobalFiltering}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        globalFilterPlaceholder={globalFilterPlaceholder}
        setFinalFilter={setFinalFilter}
        setSearchFilter={setSearchFilter}
        filterConfig={filterConfig}
        disableFilterPopup={disableFilterPopup}
        headerBtnName={headerBtnName}
        headerBtnPermissions={headerBtnPermissions}
        headerBtnEndIcon={headerBtnEndIcon}
        handleHeaderBtnClick={handleHeaderBtnClick}
      />
      <TableContent
        tablePropsObject={tablePropsObject}
        headerGroups={table.getHeaderGroups()}
        rows={table.getRowModel().rows}
        enableColumnFiltering={enableColumnFiltering}
        enableSorting={enableSorting}
        tableData={tableData}
        noDataView={noDataView}
        handleRowClick={handleRowClick}
        enablePagination={enablePagination}
        table={table}
        manualPagination={manualPagination}
        count={count}
        offset={offset}
        limit={limit}
        setOffset={setOffset}
        setLimit={setLimit}
      />
    </Box>
  );
};

// React.memo produced typed error while using generic
// Made a type to fix it
// https://github.com/DefinitelyTyped/DefinitelyTyped/issues/37087 refer this issue
type TableType = typeof ARCTable;

export const Table = memo(ARCTable) as TableType;

const NoDataComponent: React.FC<{ noDataView: React.ReactNode }> = ({
  noDataView,
}) => {
  return (
    <Box>
      <Paper
        sx={{
          minHeight: "20rem",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          boxShadow: 0,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 1,
          }}
        >
          <PostAddOutlinedIcon
            sx={{ fontSize: "3rem", color: "primary.main" }}
          />
          <Typography sx={{ fontSize: "1rem", color: "secondary.main" }}>
            No Results Found.
          </Typography>
        </Box>
        {noDataView && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginBlock: 2,
            }}
          >
            {noDataView}
          </Box>
        )}
      </Paper>
    </Box>
  );
};
