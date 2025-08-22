import {
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  Checkbox as MuiCheckbox,
  CheckboxProps as MuiCheckboxProps,
} from "@mui/material";
import { SelectNode } from "Components/Input/Input";
import InputLabel from "Components/InputLabel";
import React, { memo, useCallback } from "react";

export interface CheckboxProps extends Omit<MuiCheckboxProps, "onChange"> {
  label?: string;
  helperText?: string;
  errorMessage?: string;
  value?: string | string[];
  row?: boolean;
  singleSelect?: boolean;
  options: Array<SelectNode>;
  onChange?: (val: string | string[]) => void;
}

const handleSingleSelect = (
  currentValue: string | string[],
  targetName: string
): string => {
  return currentValue === targetName ? "" : targetName;
};

const handleMultiSelect = (
  currentValue: string[],
  targetValue: string
): string[] => {
  const index = currentValue.findIndex((val) => val === targetValue);
  const newValue = [...currentValue];

  if (index === -1) {
    newValue.push(targetValue);
  } else {
    newValue.splice(index, 1);
  }

  return newValue;
};

const isOptionChecked = (
  singleSelect: boolean | undefined,
  value: string | string[] | undefined,
  optionValue: string
): boolean => {
  if (singleSelect) {
    return value === optionValue;
  }
  return Array.isArray(value) && value.some((val) => val === optionValue);
};

const Checkbox: React.FC<CheckboxProps> = ({
  onChange,
  options = [],
  row = false,
  label,
  helperText,
  disabled,
  errorMessage,
  id,
  value,
  singleSelect,
  ...rest
}) => {
  const isError = !!errorMessage;

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!onChange) return;

      const multiSelectVal = Array.isArray(value) ? value : [];

      const newValue = singleSelect
        ? handleSingleSelect(value ?? "", e.target.name)
        : handleMultiSelect(multiSelectVal, e.target.value);

      onChange(newValue);
    },
    [onChange, singleSelect, value]
  );

  return (
    <FormControl disabled={disabled} data-testid="checkboxFormControl">
      {label && <InputLabel>{label}</InputLabel>}
      <FormGroup row={row}>
        {options.map((option) => (
          <FormControlLabel
            key={option.label}
            control={
              <MuiCheckbox
                checked={isOptionChecked(singleSelect, value, option.value)}
                onChange={handleChange}
                value={option.value}
                name={singleSelect ? option.value : id}
                {...rest}
              />
            }
            sx={{ marginTop: 1 }}
            label={option.label}
          />
        ))}
      </FormGroup>
      {(isError || helperText) && (
        <FormHelperText>{isError ? errorMessage : helperText}</FormHelperText>
      )}
    </FormControl>
  );
};

export default memo(Checkbox);
