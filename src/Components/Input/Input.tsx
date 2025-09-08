import FileCopyIcon from "@mui/icons-material/FileCopy";
import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined";
import {
  Checkbox,
  CircularProgress,
  FormControl,
  IconButton,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  OutlinedInputProps,
  Select,
  SelectChangeEvent,
  SelectProps,
  Tooltip,
} from "@mui/material";
import { SxProps, Theme } from "@mui/system";
import { AnyErrorObj, FormHelperTextComponent } from "Components/utils";
import React, { memo, useCallback, useState, useMemo } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";

export type SelectNode = {
  label: string;
  value: string;
};

export type InputBaseProps = {
  id: string;
  label?: string;
  copyEnabled?: boolean;
  errorMessage?: string | AnyErrorObj;
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
  helperText?: string;
  required?: boolean;
  labelSx?: (options?: { focused?: boolean; value?: any }) => SxProps<Theme>;
  inputSx?: (options?: { isError?: boolean }) => SxProps<Theme>;
};

export type SelectBaseProps = {
  renderSelect: boolean;
  multiple?: boolean;
  selectOptions: SelectNode[];
  isLoading?: boolean;
};

export type NonSelectInputProps = InputBaseProps &
  Omit<OutlinedInputProps, "onChange" | "value"> &
  Omit<Partial<SelectBaseProps>, "onChange"> & {
    renderSelect?: false;
    value?: string;
    onChange?: (val: string) => void;
  };

export type SelectInputPropsExtended = InputBaseProps &
  Omit<OutlinedInputProps, "onChange" | "value"> &
  Omit<SelectProps<string | string[]>, "onChange" | "value"> &
  SelectBaseProps &
  (
    | {
        renderSelect: true;
        multiple?: false;
        value?: string;
        onChange?: (val: string) => void;
      }
    | {
        renderSelect: true;
        multiple: true;
        value?: string | string[];
        onChange?: (val: string | string[]) => void;
      }
  );

export type InputProps = NonSelectInputProps | SelectInputPropsExtended;

interface OutlinedInputComponentProps
  extends Omit<OutlinedInputProps, "onChange" | "value"> {
  endAdornment: React.ReactNode;
  isError: boolean;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}

interface SelectComponentProps
  extends Omit<SelectProps<string | string[]>, "onChange" | "value"> {
  value: string | string[];
  onChange: (e: SelectChangeEvent<string | string[]>) => void;
  renderLabels: (selected: string | string[]) => string;
  isLoading?: boolean;
  isError: boolean;
  selectOptions: SelectNode[];
}

const getEndAdornment = ({
  copyEnabled,
  value,
  isError,
  endAdornment,
}: {
  copyEnabled: boolean;
  value?: OutlinedInputProps["value"];
  isError: boolean | undefined;
  endAdornment: React.ReactNode;
}) => {
  if (endAdornment && !isError) return endAdornment;

  if (isError) return <ReportProblemOutlinedIcon color="error" />;
  if (copyEnabled)
    return (
      <Tooltip title="Copy to clipboard">
        <IconButton sx={{ cursor: "pointer" }}>
          <CopyToClipboard text={value?.toString() || ""}>
            <FileCopyIcon />
          </CopyToClipboard>
        </IconButton>
      </Tooltip>
    );
  return null;
};

const SelectComponent: React.FC<SelectComponentProps> = ({
  id,
  multiple,
  value,
  label,
  required,
  isError,
  disabled,
  readOnly,
  sx,
  onChange,
  onFocus,
  onBlur,
  renderLabels,
  isLoading,
  selectOptions,
  ...rest
}) => (
  <Select<string | string[]>
    id={id}
    multiple={multiple}
    value={value}
    label={label}
    required={required}
    error={isError}
    disabled={disabled}
    readOnly={readOnly}
    sx={sx}
    onChange={onChange}
    onFocus={onFocus}
    onBlur={onBlur}
    input={<OutlinedInput label={label} />}
    renderValue={renderLabels}
    variant="outlined"
    {...rest}
  >
    {isLoading ? (
      <MenuItem disabled>
        <CircularProgress size={24} />
      </MenuItem>
    ) : (
      selectOptions?.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {multiple && (
            <Checkbox
              checked={Array.isArray(value) && value.includes(option.value)}
            />
          )}
          <ListItemText primary={option.label} />
        </MenuItem>
      ))
    )}
  </Select>
);

const OutlinedInputComponent: React.FC<OutlinedInputComponentProps> = ({
  id,
  value,
  label,
  required,
  isError,
  disabled,
  readOnly,
  sx,
  onChange,
  onFocus,
  onBlur,
  endAdornment,
  ...rest
}) => (
  <OutlinedInput
    id={id}
    value={value}
    label={label}
    required={required}
    error={isError}
    disabled={disabled}
    readOnly={readOnly}
    sx={sx}
    onChange={onChange}
    onFocus={onFocus}
    onBlur={onBlur}
    endAdornment={endAdornment}
    {...rest}
  />
);

const Input: React.FC<InputProps> = ({
  id,
  value,
  label = "",
  helperText,
  disabled = false,
  endAdornment,
  copyEnabled = false,
  errorMessage,
  onChange,
  required = false,
  labelSx,
  inputSx,
  renderSelect = false,
  multiple = false,
  selectOptions = [],
  readOnly = false,
  ...rest
}) => {
  const [focused, setFocused] = useState(false);
  const isError = !!errorMessage;

  const handleChangeEvent = useCallback(
    (
      e:
        | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
        | SelectChangeEvent<string | string[]>
    ) => {
      onChange?.(e.target.value as string);
    },
    [onChange]
  );

  const handleFocus = () => setFocused(true);
  const handleBlur = () => {
    if (!value) setFocused(false);
  };

  const computedLabelSx = labelSx?.({ focused, value });
  const computedInputSx = inputSx?.({ isError });

  const renderLabels = useCallback(
    (selected: string | string[]) => {
      const items = Array.isArray(selected) ? selected : [selected];
      return selectOptions
        .filter((option) => items.includes(option.value))
        .map((option) => option.label)
        .join(", ");
    },
    [selectOptions]
  );

  const commonProps = {
    id,
    label,
    required,
    isError,
    disabled,
    readOnly,
    onFocus: handleFocus,
    onBlur: handleBlur,
  };

  const renderComponent = () => {
    if (renderSelect) {
      const { defaultValue, isLoading, ...restWithoutDefaultValue } = rest;
      const customDefaultValue = multiple ? [] : "";
      const updatedValue = value || customDefaultValue;

      return (
        <SelectComponent
          {...commonProps}
          value={updatedValue}
          onChange={handleChangeEvent}
          sx={getSelectSx}
          multiple={multiple}
          renderLabels={renderLabels}
          isLoading={isLoading}
          selectOptions={selectOptions}
          {...restWithoutDefaultValue}
        />
      );
    }

    const outlinedInputSx: SxProps<Theme> = {
      ...computedInputSx,
      ...(readOnly && {
        pointerEvents: "none",
        color: (theme) => theme.palette.text.disabled,
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: (theme) => theme.palette.action.disabled,
        },
      }),
    };

    return (
      <OutlinedInputComponent
        {...commonProps}
        value={value as string}
        onChange={handleChangeEvent}
        sx={outlinedInputSx}
        endAdornment={getEndAdornment({
          copyEnabled,
          value,
          isError,
          endAdornment,
        })}
        {...rest}
      />
    );
  };

  const getSelectSx = useMemo(
    (): SxProps<Theme> => ({
      ...computedInputSx,
      ...((readOnly || disabled) && {
        pointerEvents: "none",
        color: (theme) => theme.palette.text.disabled,
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: (theme) => theme.palette.action.disabled,
        },
      }),
    }),
    [computedInputSx, readOnly, disabled]
  );

  return (
    <FormControl
      sx={{ width: "100%" }}
      error={isError}
      disabled={disabled}
      variant="outlined"
    >
      {label && (
        <InputLabel htmlFor={id} required={required} sx={computedLabelSx}>
          {label}
        </InputLabel>
      )}
      {renderComponent()}
      <FormHelperTextComponent
        isError={isError}
        errorMessage={errorMessage}
        helperText={helperText}
      />
    </FormControl>
  );
};

export default memo(Input);
