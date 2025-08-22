import AutoCompleteInput from "Components/AutoCompleteInput";
import {
  IAutoCompleteOptions,
  IAutoCompleteProps,
} from "Components/AutoCompleteInput/AutoCompleteInput";
import { FormikValues, useFormikContext } from "formik";
import { getValue } from "Helpers/utils";
import { useCallback } from "react";

const FormAutoCompleteInput: React.FC<IAutoCompleteProps> = ({
  id,
  disabled,
  ...rest
}) => {
  const { errors, touched, setFieldValue } = useFormikContext<FormikValues>();
  const isError = !!getValue(errors, id) && getValue(touched, id) && !disabled;
  const handleChangeEvent = useCallback(
    (values: (string | IAutoCompleteOptions)[]) => {
      const validSchema = values.map((value) => {
        if (typeof value === "string") return { label: value, value };
        return value;
      });
      setFieldValue(id, validSchema);
    },
    [id, setFieldValue]
  );

  return (
    <AutoCompleteInput
      id={id}
      disabled={disabled}
      isError={isError}
      errorMessage={isError ? getValue(errors, id) : ""}
      handleChangeEvent={handleChangeEvent}
      {...rest}
    />
  );
};

export default FormAutoCompleteInput;
