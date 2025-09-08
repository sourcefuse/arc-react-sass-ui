import * as React from "react";
import Autocomplete, {
  AutocompleteProps,
  createFilterOptions,
} from "@mui/material/Autocomplete";
import FormHelperText from "@mui/material/FormHelperText";
import { AutoCompleteChip } from "./AutoCompleteChip";

interface AnyErrorObj {
  [key: string]: any; // NOSONAR
}

export interface IAutoCompleteOptions {
  inputValue?: string;
  value: string;
  label: string;
}

const filter = createFilterOptions<IAutoCompleteOptions>();

export interface IAutoCompleteProps
  extends AutocompleteProps<string | IAutoCompleteOptions, true, false, true> {
  id: string;
  selectedOptions?: (string | IAutoCompleteOptions)[];
  isError?: boolean;
  errorMessage?: string | AnyErrorObj;
  handleChangeEvent?: (val: IAutoCompleteOptions[]) => void;
}

const AutoCompleteInput: React.FC<IAutoCompleteProps> = ({
  id,
  selectedOptions = [],
  isError = false,
  errorMessage,
  handleChangeEvent,
  options,
  ...rest
}) => {
  // Ensure selectedOptions is always an array of objects
  const [value, setValue] = React.useState<IAutoCompleteOptions[]>(
    selectedOptions.map((option) =>
      typeof option === "string" ? { label: option, value: option } : option
    )
  );

  const handleOnChange = (
    _: React.SyntheticEvent,
    newValue: (string | IAutoCompleteOptions)[]
  ) => {
    const transformedValues = newValue.map((option) =>
      typeof option === "string" ? { label: option, value: option } : option
    );

    handleChangeEvent?.(transformedValues);
    setValue(transformedValues);
  };

  return (
    <>
      <Autocomplete
        {...rest}
        multiple
        value={value}
        onChange={handleOnChange}
        clearIcon={null}
        filterOptions={(optionsArg, params) => {
          const filtered = filter(
            optionsArg.map((opt) =>
              typeof opt === "string" ? { label: opt, value: opt } : opt
            ),
            params
          );
          const { inputValue } = params;

          const isExisting = optionsArg.some(
            (option) =>
              inputValue ===
              (typeof option === "string" ? option : option.label)
          );

          if (inputValue !== "" && !isExisting) {
            filtered.push({ inputValue, label: inputValue, value: inputValue });
          }

          return filtered;
        }}
        selectOnFocus
        clearOnBlur
        handleHomeEndKeys
        id={id}
        options={options.map((opt) =>
          typeof opt === "string" ? { label: opt, value: opt } : opt
        )}
        getOptionLabel={(option) =>
          typeof option === "string" ? option : option.label
        }
        freeSolo
        renderTags={(tags, getTagProps) => (
          <>
            {tags.map((tag, index) => (
              <AutoCompleteChip
                key={typeof tag === "string" ? tag : tag.value ?? index}
                option={
                  typeof tag === "string" ? { label: tag, value: tag } : tag
                }
                getTagProps={getTagProps}
                index={index}
              />
            ))}
          </>
        )}
        open={false}
      />
      {isError && (
        <FormHelperText>
          <>{errorMessage}</>
        </FormHelperText>
      )}
    </>
  );
};

export default AutoCompleteInput;
