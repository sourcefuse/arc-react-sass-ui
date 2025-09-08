import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import Switch, { SwitchProps } from "@mui/material/Switch";
import InputLabel from "Components/InputLabel";
import { FormHelperTextComponent } from "Components/utils";
import React, { useCallback } from "react";

export interface ToggleButtonProps extends Omit<SwitchProps, "onChange"> {
  label?: string;
  helperText?: string;
  errorMessage?: string;
  row?: boolean;
  value?: string | string[];
  singleSelect?: boolean;
  options: Array<{ label: string; value: string }>;
  onChange?: (val: string | string[]) => void;
}

const handleSingleSelectChange = (
  currentValue: string | undefined,
  targetName: string
): string => {
  return currentValue === targetName ? "" : targetName;
};

const handleMultiSelectChange = (
  currentValues: string[],
  newValue: string
): string[] => {
  const index = currentValues.findIndex((val) => val === newValue);
  const updatedValues = [...currentValues];

  if (index === -1) {
    updatedValues.push(newValue);
  } else {
    updatedValues.splice(index, 1);
  }

  return updatedValues;
};

const isOptionChecked = (
  singleSelect: boolean | undefined,
  value: string | string[] | undefined,
  optionValue: string
): boolean => {
  if (singleSelect) {
    return value?.toString() === optionValue.toString();
  }
  return Array.isArray(value) && value.some((val) => val === optionValue);
};

const ToggleButton: React.FC<ToggleButtonProps> = ({
  id,
  value,
  singleSelect,
  onChange,
  options = [],
  row = false,
  label,
  helperText,
  disabled,
  errorMessage,
  ...rest
}) => {
  const isError = !!errorMessage;

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!onChange) return;

      const multiSelectValue = Array.isArray(value) ? value : [];
      const newValue = singleSelect
        ? handleSingleSelectChange(value?.toString(), e.target.name)
        : handleMultiSelectChange(multiSelectValue, e.target.value);

      onChange(newValue);
    },
    [onChange, singleSelect, value]
  );

  return (
    <FormControl disabled={disabled}>
      {label && <InputLabel>{label}</InputLabel>}
      <FormGroup row={row}>
        {options.map((option) => (
          <FormControlLabel
            key={option.label}
            control={
              <Switch
                checked={isOptionChecked(singleSelect, value, option.value)}
                sx={{ marginTop: 1 }}
                onChange={handleChange}
                value={option.value}
                name={singleSelect ? option.value.toString() : id}
                {...rest}
              />
            }
            label={option.label}
          />
        ))}
      </FormGroup>

      <FormHelperTextComponent
        isError={isError}
        errorMessage={errorMessage}
        helperText={helperText}
      />
    </FormControl>
  );
};

export default React.memo(ToggleButton);
