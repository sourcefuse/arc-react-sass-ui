import { useLocation } from "react-router";
import { useState, useEffect } from "react";
import { FilterConfig, pagesWithFutureDate } from "./Filter.utils";
import { FilterPopupState } from "./FilterPopup";
import { IDateRangePickerValue } from "Components/DateRangePicker/DateRangePicker";

interface UseFilterPopupProps {
  setFilterPopFilter?: (filter: FilterPopupState | null) => void;
  filterConfig: FilterConfig;
}

export function isDateRangePickerValue(
  value: any
): value is IDateRangePickerValue {
  return value && typeof value === "object" && "from" in value && "to" in value;
}

export const useFilterPopup = ({
  setFilterPopFilter,
  filterConfig,
}: UseFilterPopupProps) => {
  const location = useLocation();
  const defaultFilters = Object.keys(filterConfig).reduce(
    (acc, key) => ({ ...acc, [key]: null }),
    {}
  );

  const [filters, setFilters] = useState<FilterPopupState>(defaultFilters);
  const [dateRangePickerValues, setDateRangePickerValues] =
    useState<IDateRangePickerValue | null>(null);
  const [initialFilters, setInitialFilters] =
    useState<FilterPopupState>(defaultFilters);
  const [isApplied, setIsApplied] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [disableFutureDates, setDisableFutureDates] = useState(true);
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);

  useEffect(() => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      date: dateRangePickerValues,
    }));
    if (pagesWithFutureDate.includes(location.pathname)) {
      setDisableFutureDates(false);
    }
  }, [dateRangePickerValues, location.pathname]);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    if (
      isDateRangePickerValue(initialFilters.date) &&
      initialFilters.date.from
    ) {
      setShowCustomDatePicker(true);
    }
  };

  const handleApply = () => {
    const hasActiveFilters = !Object.values(filters).every(
      (value) => value === null
    );
    setIsApplied(hasActiveFilters);
    setFilterPopFilter?.(filters);
    setInitialFilters(filters);
    setAnchorEl(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setFilters(initialFilters);
    if (
      !isDateRangePickerValue(initialFilters.date) ||
      !initialFilters.date.from
    ) {
      setShowCustomDatePicker(false);
    }
  };

  const handleCustomDateClick = () => {
    setDateRangePickerValues(
      !showCustomDatePicker ? { from: new Date(), to: new Date() } : null
    );
    setShowCustomDatePicker((prev) => !prev);
  };

  const toggleFilter = (category: string, value: string | string[]) => {
    if (category === "date") {
      handleDateFilter(category, value);
    } else {
      handleRegularFilter(category, value);
    }
  };

  const handleDateFilter = (category: string, value: string | string[]) => {
    if (value === "Custom") {
      setFilters((prevFilters) => ({ ...prevFilters, date: null }));
      handleCustomDateClick();
    } else {
      setShowCustomDatePicker(false);
      setFilters((prevFilters) => ({
        ...prevFilters,
        [category]: prevFilters[category] === value ? null : value,
      }));
    }
  };

  const handleRegularFilter = (category: string, value: string | string[]) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [category]: prevFilters[category] === value ? null : value,
    }));
  };

  return {
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
  };
};
