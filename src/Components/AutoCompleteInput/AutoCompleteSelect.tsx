import { Autocomplete, TextField } from "@mui/material";
import {
  AutocompleteChangeReason,
  createFilterOptions,
} from "@mui/material/Autocomplete";
import { CustomPlanStyle } from "Pages/Tenants/AddTenant/PlanSection/CustomPlanStyle";
import { useState } from "react";

type Option = {
  label: string;
  value: string;
  inputValue?: string;
};

const filter = createFilterOptions<Option>();

type AutoCompleteProps = {
  data: Option[];
  value: string | null;
  onChange: (
    event: React.SyntheticEvent,
    newValue: any,
    reason: AutocompleteChangeReason
  ) => void;
  label: string;
};

function AutoCompleteSelect({
  data,
  value,
  onChange,
  label,
}: AutoCompleteProps) {
  const [focused, setFocused] = useState(false);

  return (
    <Autocomplete
      data-testid="autocomplete-select"
      value={value ?? null}
      options={data || []}
      getOptionLabel={(option) => {
        if (typeof option === "string") return option;
        if ("inputValue" in option && option.inputValue)
          return option.inputValue;
        return option.label;
      }}
      filterOptions={(options, params) => {
        const filtered = filter(options, params);
        const { inputValue } = params;
        const isExisting = options.some(
          (option) => inputValue === option.label
        );
        if (inputValue !== "" && !isExisting) {
          filtered.push({
            inputValue,
            label: `Add "${inputValue}"`,
            value: inputValue,
          });
        }
        return filtered;
      }}
      onChange={onChange}
      selectOnFocus
      clearOnBlur
      handleHomeEndKeys
      freeSolo
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          data-testid="cluster-type-autocomplete"
          InputProps={{
            ...params.InputProps,
            sx: {
              borderRadius: "0.625rem",
              paddingTop: "1.2rem !important",
              paddingLeft: "0.5625rem !important",
              "&.MuiOutlinedInput-root": {
                padding: 0,
              },
            },
          }}
          sx={{ ...CustomPlanStyle.inputStyles({}), pt: 0 }}
          onFocus={() => setFocused(true)}
          InputLabelProps={{
            sx: CustomPlanStyle.labelStyle({ focused }),
          }}
        />
      )}
      sx={{
        "& .MuiOutlinedInput-root": {
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "primary.stepperText",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "primary.main",
          },
        },
      }}
    />
  );
}

export default AutoCompleteSelect;
