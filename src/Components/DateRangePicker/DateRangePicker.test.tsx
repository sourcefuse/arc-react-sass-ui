import { render, screen } from "@testing-library/react";
import DateRangePicker from "./DateRangePicker";
import { vi } from "vitest";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

describe("Custom Date Range Picker", () => {
  const mockOnChange = vi.fn();
  const defaultProps = {
    value: { from: new Date("2023-01-01"), to: new Date("2023-01-31") },
    onChange: mockOnChange,
    disabled: false,
    errorMessage: "",
    sx: {},
  };

  it("renders without crashing", () => {
    render(
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DateRangePicker {...defaultProps} />
      </LocalizationProvider>
    );

    expect(screen.getByText("From")).toBeInTheDocument();
    expect(screen.getByText("To")).toBeInTheDocument();
  });

  it("shows error message when errorMessage prop is provided", () => {
    render(
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DateRangePicker {...defaultProps} errorMessage="Error" />
      </LocalizationProvider>
    );
    expect(screen.getByTestId("date-picker-form-control")).toBeInTheDocument();
  });
});
