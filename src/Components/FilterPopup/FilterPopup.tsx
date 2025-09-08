import { Close } from "@mui/icons-material";
import { Box, Button, IconButton, Popover, Typography } from "@mui/material";
import DateRangePicker, {
  IDateRangePickerValue,
} from "Components/DateRangePicker/DateRangePicker";
import { colors } from "Providers/theme/colors";
import React from "react";
import filterIcon from "../../Assets/filter-icon.png";
import { FilterConfig } from "./Filter.utils";
import { FilterCategories } from "./FilterCategories";
import { useFilterPopup } from "./useFilterPopup";

export interface FilterPopupState {
  [key: string]: string | IDateRangePickerValue | null | string[];
}

interface FilterPopupProps {
  setFilterPopFilter?: (filter: FilterPopupState | null) => void;
  filterConfig?: FilterConfig;
}

export const FilterPopup: React.FC<FilterPopupProps> = ({
  setFilterPopFilter,
  filterConfig = {},
}) => {
  const {
    filters,
    isApplied,
    anchorEl,
    showCustomDatePicker,
    dateRangePickerValues,
    disableFutureDates,
    handleOpen,
    handleClose,
    handleApply,
    toggleFilter,
    setDateRangePickerValues,
  } = useFilterPopup({ setFilterPopFilter, filterConfig });

  const open = Boolean(anchorEl);
  const id = open ? "filter-popover" : undefined;

  return (
    <Box>
      <FilterButton id={id} isApplied={isApplied} handleOpen={handleOpen} />
      <FilterPopover
        id={id}
        open={open}
        anchorEl={anchorEl}
        handleClose={handleClose}
        handleApply={handleApply}
      >
        <FilterCategories
          filterConfig={filterConfig}
          filters={filters}
          toggleFilter={toggleFilter}
          showCustomDatePicker={showCustomDatePicker}
        />
        {showCustomDatePicker && (
          <DateRangePicker
            onChange={setDateRangePickerValues}
            value={dateRangePickerValues}
            disableFutureDates={disableFutureDates}
          />
        )}
      </FilterPopover>
    </Box>
  );
};

const FilterButton: React.FC<{
  id?: string;
  isApplied: boolean;
  handleOpen: (event: React.MouseEvent<HTMLElement>) => void;
}> = ({ id, isApplied, handleOpen }) => (
  <IconButton aria-describedby={id} onClick={handleOpen}>
    <img src={filterIcon} alt="open filter" style={{ marginTop: "0.2rem" }} />
    {isApplied && (
      <Box
        sx={{
          width: "0.5rem",
          height: "0.5rem",
          bgcolor: colors.selectFilter,
          borderRadius: "50%",
          position: "absolute",
          top: "0.5rem",
          right: "0.4rem",
        }}
      />
    )}
  </IconButton>
);

const FilterPopover: React.FC<{
  id?: string;
  open: boolean;
  anchorEl: HTMLElement | null;
  handleClose: () => void;
  handleApply: () => void;
  children: React.ReactNode;
}> = ({ id, open, anchorEl, handleClose, handleApply, children }) => (
  <Popover
    id={id}
    open={open}
    anchorEl={anchorEl}
    onClose={handleClose}
    anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
    slotProps={{
      paper: {
        sx: {
          borderRadius: "1.25rem",
          marginTop: "0.5rem",
        },
      },
    }}
  >
    <Box p={3} width="28.125rem" data-testid="filter-component">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography
          variant="h6"
          sx={{ fontWeight: 500, color: colors.filterText }}
        >
          Filter
        </Typography>
        <IconButton onClick={handleClose} size="small">
          <Close />
        </IconButton>
      </Box>
      <hr style={{ opacity: 0.4 }} />
      {children}
      <Box display="flex" justifyContent="end">
        <Button
          variant="outlined"
          data-testid="close-filter-btn"
          onClick={handleClose}
          sx={{ mx: 1, borderRadius: 5 }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          sx={{ mx: 1, borderRadius: 5 }}
          onClick={handleApply}
        >
          Apply
        </Button>
      </Box>
    </Box>
  </Popover>
);

export default FilterPopup;
