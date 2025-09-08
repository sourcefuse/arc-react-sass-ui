import {
  Box,
  MenuItem,
  Pagination,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import React, { useEffect } from "react";
import {
  defaultRowsPerPageOptions,
  PaginationComponentWithToolTip,
} from "./helper";
import { useGetAdminSettingsQuery } from "redux/app/adminSettingsApiSlice";
import { DEFAULT_LIMIT } from "Constants/helper";
import { useQueryHookWithPermission } from "Hooks/useQueryHookWithPermission";
import { PermissionsEnum } from "Constants/enums";

interface TablePaginationProps {
  count: number;
  offset?: number;
  limit?: number;
  pageIndex?: number;
  rowsPerPage?: number;
  setOffset?: (page: number) => void;
  setLimit?: (size: number) => void;
  onPageChange?: (page: number) => void;
  onRowsPerPageChange?: (size: number) => void;
  manualPagination?: boolean;
}

export const TablePagination: React.FC<TablePaginationProps> = ({
  count,
  offset = 0,
  limit = 10,
  pageIndex = 0,
  rowsPerPage = 10,
  setOffset,
  setLimit,
  onPageChange,
  onRowsPerPageChange,
  manualPagination = false,
}) => {
  const { data: adminSettings } = useQueryHookWithPermission(
    [PermissionsEnum.ViewAdminSettings],
    useGetAdminSettingsQuery,
    undefined,
    {}
  );

  useEffect(() => {
    setLimit?.(Number(adminSettings?.rowsPerListing) || DEFAULT_LIMIT);
  }, [adminSettings?.rowsPerListing, setLimit]);

  const currentPage = manualPagination
    ? Math.ceil(offset / limit) + 1
    : pageIndex + 1;
  const totalPages = Math.ceil(
    count / (manualPagination ? limit : rowsPerPage)
  );

  const updatePageForManualPagination = (newPage: number) => {
    setOffset?.((newPage - 1) * limit);
  };

  const updatePageForAutomaticPagination = (newPage: number) => {
    onPageChange?.(newPage - 1);
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    const handler = manualPagination
      ? updatePageForManualPagination
      : updatePageForAutomaticPagination;
    handler(value);
  };

  const handleRowsPerPageChange = (event: SelectChangeEvent<number>) => {
    const newSize = Number(event.target.value);
    if (!manualPagination) {
      onRowsPerPageChange?.(newSize);
      return;
    }
    setLimit?.(newSize);
    setOffset?.(0);
  };

  const handlePageNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPage = Math.min(
      Math.max(1, Number(e.target.value) || 1),
      totalPages || 1
    );
    const handler = manualPagination
      ? updatePageForManualPagination
      : updatePageForAutomaticPagination;
    handler(newPage);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
      }}
    >
      <Box sx={{ flex: 1, display: "flex", justifyContent: "center" }}>
        <Pagination
          count={totalPages}
          page={currentPage}
          siblingCount={0}
          boundaryCount={1}
          onChange={handlePageChange}
          color="primary"
          sx={{ padding: "1rem" }}
          variant="outlined"
          shape="rounded"
          renderItem={(item) => PaginationComponentWithToolTip(item)}
        />
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <label style={{ fontSize: "1rem" }} htmlFor="page-number">
          Go to Page :
        </label>
        <TextField
          id="page-number"
          type="number"
          size="small"
          value={currentPage}
          onChange={handlePageNumberChange}
          inputProps={{ min: 1, max: totalPages }}
          sx={{ width: 60 }}
        />
        <label style={{ fontSize: "1rem" }} htmlFor="page-select">
          Show :
        </label>
        <Select
          id="page-select"
          value={manualPagination ? limit : rowsPerPage}
          onChange={handleRowsPerPageChange}
          size="small"
          displayEmpty
        >
          {defaultRowsPerPageOptions.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.label}
            </MenuItem>
          ))}
        </Select>
      </Box>
    </Box>
  );
};
