import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import {
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  TextFieldProps,
} from "@mui/material";
import { useEffect, useState } from "react";

interface Props extends Omit<TextFieldProps, "onChange"> {
  value: string | number;
  onChange: (val: string | number) => void;
  debounceTime?: number;
}
const DEBOUNCE_TIME = 300;
export const DebouncedInput = ({
  value: initialValue,
  onChange,
  debounceTime = DEBOUNCE_TIME,
  ...props
}: Props) => {
  const [value, setValue] = useState(initialValue);

  // setValue if any initialValue changes
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  // debounce onChange — triggered on every keypress
  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounceTime);

    return () => {
      clearTimeout(timeout);
    };
  }, [value, onChange, debounceTime]);

  const handleClearClick = () => {
    setValue("");
    onChange("");
  };

  return (
    <Stack direction="row">
      <TextField
        size="small"
        placeholder="Search"
        {...props}
        sx={{
          background: "white",
          borderRadius: "0.5rem",
          width: "100%",
        }}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start" sx={{ mx: 0 }}>
              {value ? (
                <IconButton aria-label="clear" onClick={handleClearClick}>
                  <ClearIcon />
                </IconButton>
              ) : (
                <IconButton aria-label="search">
                  <SearchIcon />
                </IconButton>
              )}
            </InputAdornment>
          ),
          sx: { paddingLeft: 0 },
        }}
      />
    </Stack>
  );
};
