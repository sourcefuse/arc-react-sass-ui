import {
  Box,
  TablePaginationProps as MuiTablePaginationProps,
  TableRowProps as MuiTableRowProps,
  PaginationItem,
  PaginationItemProps,
  TablePagination,
  TableRow,
  Tooltip,
} from "@mui/material";
import TableCell, { TableCellProps } from "@mui/material/TableCell";
import TableSortLabel from "@mui/material/TableSortLabel";
import { Header, Row, SortingState, flexRender } from "@tanstack/react-table";
import {
  FilterConfig,
  FilterPopup,
  FilterPopupState,
} from "Components/FilterPopup";
import React, { ReactElement, useCallback, useEffect, useState } from "react";
import { DebouncedInput } from "./DebounceInput";
import TablePaginationActions from "./TablePaginationActions";
import { AnyObject } from "./Table";
import { colors } from "../../Providers/theme/colors";
import SortingIconComponent from "./SortingIconComponent";
import { getBackendColumnName } from "Constants/columnNameMap";

interface ColumnProps<T extends AnyObject> {
  header: Header<T, unknown>;
  index: number;
  enableSorting?: boolean;
  enableColumnFiltering?: boolean;
  columnCellProps?: TableCellProps;
}

type TableRowProps<T extends AnyObject> = {
  row: Row<T>;
  index: number;
  bodyCellProps?: TableCellProps;
  bodyRowProps?: MuiTableRowProps;
  onClick?: () => void;
  isClickable: boolean;
};

export const DefaultColumn = <T extends AnyObject>({
  header,
  index,
  enableSorting,
  columnCellProps,
}: ColumnProps<T>) => {
  return (
    <TableCell
      key={header.id}
      sx={{
        fontWeight: 400,
        color: "customText.column",
        textAlign: "left",
      }}
      {...columnCellProps}
    >
      <span
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        {header.isPlaceholder
          ? null
          : flexRender(header.column.columnDef.header, header.getContext())}
        {enableSorting && header.column.columnDef.enableSorting !== false && (
          <TableSortLabel
            hideSortIcon={
              (header.column.columnDef.enableSorting as boolean) === false
            }
            active={!!header.column.getIsSorted()}
            onClick={header.column.getToggleSortingHandler()}
            direction={header.column.getIsSorted() === "asc" ? "asc" : "desc"}
            sx={{
              "& .MuiTableSortLabel-icon": {
                opacity: 1,
                transition: "none",
              },
            }}
            IconComponent={(params) => (
              <SortingIconComponent
                direction={header.column.getIsSorted()}
                handleTrigger={header.column.getToggleSortingHandler()}
                {...params}
              />
            )}
          />
        )}
      </span>
    </TableCell>
  );
};

export const DefaultRow = <T extends AnyObject>({
  row,
  index,
  bodyCellProps,
  bodyRowProps,
  onClick,
  isClickable,
}: TableRowProps<T>) => {
  return (
    <TableRow
      key={row.id}
      sx={{
        "&:last-child td, &:last-child th": { border: 0 },
        cursor: isClickable ? "pointer" : "default",
      }}
      {...bodyRowProps}
      onClick={(e) => {
        e.stopPropagation();
        onClick && onClick();
      }}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell
          key={cell.id}
          sx={{ textAlign: "left", color: colors.text }}
          {...bodyCellProps}
        >
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  );
};

interface GlobalFilterProps {
  globalFilter: string;
  setGlobalFilter: React.Dispatch<React.SetStateAction<string>>;
  globalFilterSearchPlaceholder?: string;
  setFinalFilter?: (data: FilterPopupState | null) => void;
  setSearchFilter?: (data: string) => void;
  filterConfig?: FilterConfig;
  disableFilterPopup?: boolean;
}

export const GlobalFilter: React.FC<GlobalFilterProps> = ({
  globalFilter,
  setGlobalFilter,
  globalFilterSearchPlaceholder = "Search",
  setFinalFilter,
  setSearchFilter = setGlobalFilter,
  filterConfig = {},
  disableFilterPopup,
}) => {
  return (
    <Box display="flex" justifyContent="flex-end">
      <DebouncedInput
        id="global-search"
        value={globalFilter ?? ""}
        onChange={(value) => setSearchFilter(String(value))}
        variant="outlined"
        placeholder={globalFilterSearchPlaceholder}
      />
      {!disableFilterPopup && (
        <Box sx={{ borderRadius: "50%", bgcolor: "white", mx: 1, px: 0.5 }}>
          <FilterPopup
            setFilterPopFilter={setFinalFilter}
            filterConfig={filterConfig}
          />
        </Box>
      )}
    </Box>
  );
};
type TablePaginationProps = {
  rowsPerPageOptions: (number | { label: string; value: number })[];
  count: number;
  pageSize: number;
  pageIndex: number;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => void;
  onRowsPerPageChange: (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => void;
  tablePaginationProps?: MuiTablePaginationProps;
};

export const DefaultTablePagination: React.FC<TablePaginationProps> = ({
  rowsPerPageOptions,
  count,
  pageSize,
  pageIndex,
  onPageChange,
  onRowsPerPageChange,
  tablePaginationProps,
}: TablePaginationProps) => {
  return (
    <TablePagination
      rowsPerPageOptions={rowsPerPageOptions}
      component="div"
      count={count}
      rowsPerPage={pageSize}
      page={pageIndex}
      slotProps={{
        select: {
          inputProps: { "aria-label": "rows per page" },
          native: true,
        },
      }}
      onPageChange={onPageChange}
      onRowsPerPageChange={onRowsPerPageChange}
      ActionsComponent={TablePaginationActions}
      {...tablePaginationProps}
    />
  );
};

export const DefaultFullWidthRow: React.FC<{ children: ReactElement }> = ({
  children,
}) => (
  <TableRow>
    <TableCell colSpan={100}>{children}</TableCell>
  </TableRow>
);

export const defaultRowsPerPageOptions = [
  { label: "5", value: 5 },
  { label: "10", value: 10 },
  { label: "25", value: 25 },
  { label: "50", value: 50 },
  { label: "100", value: 100 },
];

export const useHandleLocalStorage = (handleSortColumnChange: any) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const saveSortingToLocalStorage = (
    newSorting: SortingState,
    sortOrder: string | null
  ) => {
    const pageName = window.location.pathname;
    const sortingPreferences = {
      newSorting,
      sortOrder,
    };
    const savedSorting = localStorage.getItem("sortingPreferences");
    const sortingData = savedSorting ? JSON.parse(savedSorting) : {};
    sortingData[pageName] = sortingPreferences;
    localStorage.setItem("sortingPreferences", JSON.stringify(sortingData));
  };
  const getSortingFromLocalStorage = useCallback((pageName: string) => {
    const savedSorting = localStorage.getItem("sortingPreferences");
    if (savedSorting) {
      try {
        const sortingPreferences = JSON.parse(savedSorting);
        return sortingPreferences[pageName] ?? null; // Return sorting for the specific page or null if not found
      } catch (error) {
        console.error(
          "Error parsing sorting preferences from local storage:",
          error
        );
      }
    }
    return null;
  }, []);
  const getSortingOrder = (sortingState: SortingState): string | null => {
    if (sortingState.length === 0) return null;

    const { id, desc } = sortingState[0];
    const direction = desc ? "desc" : "asc";
    return `${getBackendColumnName(id)} ${direction}`;
  };

  const handleSortingChange = (
    updaterOrValue: SortingState | ((old: SortingState) => SortingState)
  ) => {
    if (!handleSortColumnChange) return;

    const newSorting =
      typeof updaterOrValue === "function"
        ? updaterOrValue(sorting)
        : updaterOrValue;
    const sortOrder = getSortingOrder(newSorting);

    handleSortColumnChange(sortOrder);
    setSorting(newSorting);
    saveSortingToLocalStorage(newSorting, sortOrder);
  };

  useEffect(() => {
    const savedSorting = getSortingFromLocalStorage(window.location.pathname);
    if (savedSorting && handleSortColumnChange) {
      handleSortColumnChange(savedSorting.sortOrder);
      setSorting(savedSorting.newSorting);
    }
  }, [getSortingFromLocalStorage, handleSortColumnChange]);

  return {
    saveSortingToLocalStorage,
    getSortingFromLocalStorage,
    handleSortingChange,
    sorting,
    setSorting,
  };
};

export const PaginationComponentWithToolTip = (item: PaginationItemProps) => {
  if (item.type !== "previous" && item.type !== "next") {
    return <PaginationItem {...item} />;
  }
  const tooltipTitle = item.type === "previous" ? "Previous" : "Next";
  return (
    <Tooltip title={tooltipTitle}>
      <span>
        <PaginationItem {...item} />
      </span>
    </Tooltip>
  );
};
