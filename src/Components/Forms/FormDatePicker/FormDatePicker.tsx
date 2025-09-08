import DatePicker, { DatePickerProps } from "Components/DatePicker/DatePicker";
import { useFormikContext } from "formik";
import React, { useCallback } from "react";

type Formik = {
  [x: string]: Date | null;
};

const FormDatePicker: React.FC<DatePickerProps> = ({
  id,
  disabled,
  ...rest
}) => {
  const { setFieldValue, errors, touched, values } = useFormikContext<Formik>();
  const isError = !!errors[id] && touched[id] && !disabled;
  const handleChange = useCallback(
    (val: Date | null) => setFieldValue(id, val),
    [id, setFieldValue]
  );

  return (
    <DatePicker
      id={id}
      value={values[id] ?? null}
      errorMessage={isError ? (errors[id] as string) : ""}
      disabled={disabled}
      onChange={handleChange}
      {...rest}
    />
  );
};

export default FormDatePicker;
