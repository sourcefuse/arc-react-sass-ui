import { Box, Chip, Typography } from "@mui/material";
import { colors } from "Providers/theme/colors";
import React from "react";
import { FilterConfig } from "./Filter.utils";
import { FilterPopupState } from "./FilterPopup";

interface FilterCategoriesProps {
  filterConfig: FilterConfig;
  filters: FilterPopupState;
  toggleFilter: (category: string, value: string | string[]) => void;
  showCustomDatePicker: boolean;
}

export const FilterCategories: React.FC<FilterCategoriesProps> = ({
  filterConfig,
  filters,
  toggleFilter,
  showCustomDatePicker,
}) => (
  <>
    {Object.entries(filterConfig).map(([category, config]) => (
      <Box key={category} mb={2}>
        <Typography
          variant="body1"
          sx={{ mb: 1, color: colors.filterText, opacity: 0.8 }}
        >
          {config.label}
        </Typography>
        <Box display="flex" flexWrap="wrap" gap={1}>
          {config.options.map((option) => (
            <FilterChip
              key={
                Array.isArray(option.value)
                  ? option.value.join(",")
                  : option.value
              }
              category={category}
              option={option}
              filters={filters}
              showCustomDatePicker={showCustomDatePicker}
              toggleFilter={toggleFilter}
            />
          ))}
        </Box>
      </Box>
    ))}
  </>
);

const FilterChip: React.FC<{
  category: string;
  option: { label: string; value: string | string[] };
  filters: FilterPopupState;
  showCustomDatePicker: boolean;
  toggleFilter: (category: string, value: string | string[]) => void;
}> = ({ category, option, filters, showCustomDatePicker, toggleFilter }) => {
  const isCustomDateSelected =
    category === "date" && option.value === "Custom" && showCustomDatePicker;
  const isSelected = filters[category] === option.value || isCustomDateSelected;

  return (
    <Chip
      label={option.label}
      sx={{
        borderRadius: "1rem",
        bgcolor: isSelected ? colors.selectFilter : "transparent",
        color: isSelected ? "white" : colors.filterText,
        border: isSelected ? "none" : `0.1rem solid ${colors.filterBorder}`,
        "&:hover": {
          bgcolor: isSelected ? colors.selectFilter : "transparent",
        },
      }}
      clickable
      onClick={() => toggleFilter(category, option.value)}
    />
  );
};
