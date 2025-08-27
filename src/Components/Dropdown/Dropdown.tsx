import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import Autocomplete, {
  AutocompleteProps,
  AutocompleteRenderInputParams,
} from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import { SxProps } from "@mui/system";
import InputLabel from "Components/InputLabel";
import { FormHelperTextComponent } from "Components/utils";
import { Theme } from "pretty-format";
import React, { useCallback, useMemo } from "react";

interface IOptionNode {
  label: string;
  value: string;
}

export type AutocompleteValueType =
  | NonNullable<string | IOptionNode>
  | (string | IOptionNode)[];

type UpdatedAutocompleteProps = AutocompleteProps<
  IOptionNode,
  boolean,
  boolean,
  boolean
>;

export interface DropdownProps
  extends Omit<
    UpdatedAutocompleteProps,
    "renderInput" | "options" | "value" | "onChange"
  > {
  id: string;
  label?: string;
  disabled?: boolean;
  enableAutoComplete?: boolean;
  multiple?: boolean;
  helperText?: string;
  errorMessage?: string;
  options: Array<IOptionNode>;
  onChange?: (val: AutocompleteValueType) => void;
  width?: number;
  disableBorder?: boolean;
  isLoading?: boolean;
}

interface Props extends DropdownProps {
  value?: AutocompleteValueType;
}

const getDisplayValue = (value: AutocompleteValueType | undefined): string => {
  if (Array.isArray(value)) return "";
  if (typeof value === "string") return value;
  return value?.label || "";
};

const getOptionLabel = (option: IOptionNode | string): string => {
  if (typeof option !== "string") {
    return option?.label || "";
  }
  return "";
};

const MultipleOptionRenderer: React.FC<{
  props: any;
  option: IOptionNode;
  selected: boolean;
}> = ({ props, option, selected }) => (
  <li {...props}>
    <Checkbox
      icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
      checkedIcon={<CheckBoxIcon fontSize="small" />}
      checked={selected}
    />
    {option.label}
  </li>
);

const SingleOptionRenderer: React.FC<{
  props: any;
  option: IOptionNode;
}> = ({ props, option }) => (
  <Box component="li" {...props}>
    {option.label}
  </Box>
);

const DropdownInput: React.FC<{
  params: AutocompleteRenderInputParams;
  isError: boolean;
  enableAutoComplete: boolean;
  multiple: boolean;
  displayValue: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({
  params,
  isError,
  enableAutoComplete,
  multiple,
  displayValue,
  handleInputChange,
}) => (
  <TextField
    error={!!isError}
    {...params}
    onChange={handleInputChange}
    inputProps={{
      ...params.inputProps,
      readOnly: !enableAutoComplete,
      sx: {
        caretColor: !enableAutoComplete && "transparent",
        cursor: !enableAutoComplete && "pointer !important",
      },
      ...(enableAutoComplete && !multiple && { value: displayValue }),
    }}
  />
);

const Dropdown: React.FC<Props> = ({
  id,
  errorMessage,
  disabled,
  label,
  helperText,
  options,
  onChange,
  enableAutoComplete = false,
  value,
  multiple: initialMultiple,
  width,
  disableBorder,
  isLoading,
  ...rest
}) => {
  const multiple = enableAutoComplete ? false : initialMultiple;
  const isError = !!errorMessage;
  const newId = enableAutoComplete ? id : `${id}-${Date.now()}`;
  const displayValue = useMemo(() => getDisplayValue(value), [value]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!enableAutoComplete || !onChange || multiple) return;
      const inputValue = e.target.value;

      if (inputValue) {
        onChange({
          label: inputValue,
          value: inputValue,
        });
      }
    },
    [enableAutoComplete, multiple, onChange]
  );

  const renderInput = (params: AutocompleteRenderInputParams) => (
    <DropdownInput
      params={params}
      isError={isError}
      enableAutoComplete={enableAutoComplete}
      multiple={!!multiple}
      displayValue={displayValue}
      handleInputChange={handleInputChange}
    />
  );

  const autoCompleteTheme: SxProps<Theme> = {
    "& .MuiOutlinedInput-root": {
      padding: "0.063rem",
    },
    "& .MuiOutlinedInput-notchedOutline": {
      ...(disableBorder && { border: "none" }),
    },
    marginTop: 2,
  };

  const renderOption: UpdatedAutocompleteProps["renderOption"] = (
    props,
    option,
    { selected }
  ) => (
    <React.Fragment key={option.value}>
      {multiple ? (
        <MultipleOptionRenderer
          props={props}
          option={option}
          selected={selected}
        />
      ) : (
        <SingleOptionRenderer props={props} option={option} />
      )}
    </React.Fragment>
  );

  return (
    <FormControl
      sx={{ width: width ?? 1 }}
      data-testid="dropdownFormControl"
      error={isError}
    >
      {label && <InputLabel htmlFor={id}>{label}</InputLabel>}
      <Autocomplete
        data-testid="dropdownAutocomplete"
        id={newId}
        options={options}
        loading={isLoading}
        freeSolo={enableAutoComplete}
        disableClearable={!enableAutoComplete}
        isOptionEqualToValue={(option, val) => option?.value === val?.value}
        getOptionLabel={getOptionLabel}
        disableCloseOnSelect={multiple}
        renderOption={renderOption}
        sx={autoCompleteTheme}
        disabled={disabled}
        onChange={(_, val) => val && onChange?.(val)}
        renderInput={renderInput}
        value={value}
        multiple={multiple}
        {...rest}
      />
      <FormHelperTextComponent
        isError={isError}
        errorMessage={errorMessage}
        helperText={helperText}
      />
    </FormControl>
  );
};

export default Dropdown;
