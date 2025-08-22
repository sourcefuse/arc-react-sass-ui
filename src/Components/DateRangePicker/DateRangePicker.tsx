import FormControl from "@mui/material/FormControl";
import { SxProps, Theme } from "@mui/material/styles";
import DatePicker from "Components/DatePicker/DatePicker";
import { useCallback, useState } from "react";

// use this type for value
export interface IDateRangePickerValue {
  from: Date;
  to: Date;
}

type DateRangeKeys = keyof IDateRangePickerValue;
interface IDateRangePickerProps {
  value?: IDateRangePickerValue | null;
  onChange?: (value: IDateRangePickerValue) => void;
  errorMessage?: string;
  sx?: SxProps<Theme>;
  disableFutureDates?: boolean;
}

const DateRangePicker: React.FC<IDateRangePickerProps> = ({
  value,
  onChange,
  errorMessage,
  sx,
  disableFutureDates = true,
}) => {
  const [dateValue, setDateValue] = useState<IDateRangePickerValue>(
    value || { from: new Date(), to: new Date() }
  );
  const isError = !!errorMessage;

  const handleDateChange = useCallback(
    (key: DateRangeKeys, newValue: Date | null) => {
      setDateValue({ ...dateValue, [key]: newValue });
      onChange?.({ ...dateValue, [key]: newValue });
    },
    [onChange, dateValue]
  );

  return (
    <FormControl
      sx={{ display: "flex", flexDirection: "row", gap: 2, m: 1, ...sx }}
      data-testid="date-picker-form-control"
      error={isError}
    >
      <DatePicker
        value={dateValue.from}
        onChange={(date) => handleDateChange("from", date)}
        id="from-date-picker"
        InputAdornmentProps={{
          position: "end",
        }}
        label="From"
        disableFuture={disableFutureDates}
      />
      <DatePicker
        value={dateValue.to}
        minDate={dateValue.from}
        onChange={(date) => handleDateChange("to", date)}
        id="to-date-picker"
        InputAdornmentProps={{
          position: "end",
        }}
        label="To"
        disableFuture={disableFutureDates}
      />
    </FormControl>
  );
};

export default DateRangePicker;
